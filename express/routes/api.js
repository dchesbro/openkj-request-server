const Database = require('better-sqlite3');
const express = require('express');
const rand = require('lodash.random');

const db = new Database('songbook.db', { verbose: console.log });
const router = express.Router();

db.prepare(`CREATE TABLE IF NOT EXISTS songdb (song_id INTEGER PRIMARY KEY AUTOINCREMENT, artist TEXT, title TEXT, combined TEXT UNIQUE)`).run();
db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_songstrings ON songdb(combined)`).run();
db.prepare(`CREATE TABLE IF NOT EXISTS state (accepting BOOL, serial INTEGER NOT NULL)`).run();
db.prepare(`INSERT OR IGNORE INTO state (rowid,accepting,serial) VALUES(0,0,1)`).run();
db.prepare(`CREATE TABLE IF NOT EXISTS requests (request_id INTEGER PRIMARY KEY AUTOINCREMENT, artist TEXT, title TEXT, singer TEXT, request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`).run();

/**
 * Check whether venue is accepting song requests.
 */
function getAccepting() {
  const state = db.prepare(`SELECT accepting FROM state`).get();

  return state.accepting ? true : false;
}

/**
 * Get venue serial number.
 */
function getSerial() {
  const state = db.prepare(`SELECT serial FROM state`).get();

  return state.serial ?? -1;
}

/**
 * Get songs matching defined search term(s).
 * 
 * @param {Object} args Request JSON data.
 */
function getSongs(args) {
  const { searchString } = args;
  const terms = searchString.replace(/\s+/g, ' ').trim().split(' ');

  let where = '';

  if (terms.length === 1) {
    where = `WHERE combined LIKE '%${terms[0]}%'`;
  } else if (terms.length > 1) {
    where = terms.map((value, index) => {
      if (index === 0) {
        return `WHERE combined LIKE '%${value}%'`;
      } else if (index === terms.length - 1) {
        return `AND combined LIKE '%${value}%' AND artist!='DELETED'`
      } else {
        return `AND combined LIKE '%${value}%'`;
      }
    }).join(' ');
  }

  return db.prepare(
    `SELECT * FROM songdb ${where} ORDER BY UPPER(artist), UPPER(title)`
  ).all() ?? [];
}

/**
 * Add request record to database.
 * 
 * @param {Object} args Request JSON data.
 */
function insertRequest(args) {
  const { singerName, songId } = args;
  const song = db.prepare(
    `SELECT artist,title FROM songdb WHERE song_id=?`
  ).get(songId);
  const info = db.prepare(
    `INSERT INTO requests (singer,artist,title) VALUES(?,?,?)`
  ).run(singerName, song.artist, song.title);

  setSerial();

  return info.changes ? true : false;
}

/**
 * Set venue serial number.
 */
function setSerial() {
  const serialPrev = getSerial();

  let serialNew = rand(0, 99999);
  
  while (serialNew === serialPrev) {
    serialNew = rand(0, 99999);
  }

  db.prepare(`UPDATE state SET serial=?`).run(serialNew);

  return serialNew;
}

/**
 * Set whether venue is accepting song requests. 
 * 
 * @param {Object} args Request JSON data.
 */
function setAccepting(args) {
  const { accepting } = args;

  db.prepare(`UPDATE state SET accepting=?`).run(accepting ? 1 : 0);

  return accepting;
}

/* POST request server commands. */
router.post('/', function(req, res, next) {
  const { command } = req.body;

  console.log(req);

  let data = {
    command: command,
    error: false,
  };

  console.log(req.body);

  switch(command) {

    /* Mobile songbook apps. */
    case 'getSerial':
      data.serial = getSerial();
      break;
    case 'search':
      data.songs = getSongs(req.body);
      break;
    case 'submitRequest':
      data.success = insertRequest(req.body);
      break;
    case 'venueAccepting':
      data.accepting = getAccepting();
      break;

    /* OpenKJ apps. */
    case 'addSongs':
      const { songs } = req.body;
      const insert = db.prepare(
        `INSERT OR IGNORE INTO songdb (artist,title,combined) VALUES(?,?,?)`
      );
      const insertSongs = db.transaction((items) => {
        for (const item of items) {
          curr_artist = item.artist;
          curr_title = item.title;
          
          try {
            insert.run(item.artist, item.title, `${item.artist} ${item.title}`);
          } catch (err) {
            errors.push(err);
          }
  
          count++;
        };
      });

      let count = 0;
      let curr_artist = '';
      let curr_title = '';
      let errors = [];

      insertSongs(songs);

      data.entries_processed = count;
      data.error = errors.length ? true : false;
      data.errors = errors;
      data.last_artist = curr_artist;
      data.last_title = curr_title;
      break;
    case 'clearDatabase':
      db.prepare(`DELETE FROM songdb`).run();
      db.prepare(`DELETE FROM requests`).run();

      data.serial = setSerial();
      break;
    case 'clearRequests':
      db.prepare(`DELETE FROM requests`).run();

      data.serial = setSerial();
      break;
    case 'connectionTest':
      data.connection = 'ok';
      break;
    case 'deleteRequest':
      const { request_id } = req.body;

      db.prepare(`DELETE FROM requests WHERE request_id=?`).run(request_id);

      data.serial = setSerial();
      break;
    case 'getAccepting':
      data.accepting = getAccepting();
      data.venue_id = 0;
      break;
    case 'getRequests':
      data.requests = db.prepare(
        `SELECT request_id,artist,title,singer,cast(strftime('%s', request_time) as int) AS request_time FROM requests`
      ).all() ?? [];
      data.serial = getSerial();
      break;
    case 'getSerial':
      data.serial = getSerial();
      break;
    case 'getVenues':
      data.venues = [
        {
          accepting: getAccepting(),
          name: 'OpenKJ Server',
          url_name: 'none',
          venue_id: 0,
        },
      ];
      break;
    case 'setAccepting':
      data.accepting = setAccepting(req.body);
      data.serial = setSerial();
      data.venue_id = 0;
      break;

    /* Default (invalid command). */
    default:
      data.error = true;
      data.errorString = 'Invalid command'
      break;
  }

  res.send(data);
});

module.exports = router;
