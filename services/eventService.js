const sequelize = require('../config/sequelize');

class EventService {
  
  async createEvent(title, dateTime, location, capacity) {
    if (capacity <= 0 || capacity > 1000) {
      throw new Error('Capacity must be between 1 and 1000');
    }

    if (new Date(dateTime) < new Date()) {
      throw new Error('Event date must be in the future');
    }

    const [[result]] = await sequelize.query(
      `INSERT INTO events (title, "dateTime", location, capacity)
       VALUES (:title, :dateTime, :location, :capacity)
       RETURNING id`,
      {
        replacements: { title, dateTime, location, capacity },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    return result.id;
  }

  
  async getEventDetails(eventId) {
    console.log("➡️ Fetching event details for eventId:", eventId);

    const rows = await sequelize.query(
      `SELECT
        events.id AS event_id,
        events.title,
        events."dateTime",
        events.location,
        events.capacity,
        users.id AS user_id,
        users.name,
        users.email
      FROM events
      LEFT JOIN registrations ON events.id = registrations."eventId"
      LEFT JOIN users ON users.id = registrations."userId"
      WHERE events.id = :eventId`,
      {
        replacements: { eventId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!rows || rows.length === 0) {
      throw new Error('Event not found');
    }

    const event = {
      id: rows[0].event_id,
      title: rows[0].title,
      dateTime: rows[0].dateTime,
      location: rows[0].location,
      capacity: rows[0].capacity,
      registrations: [],
    };

    event.registrations = rows
      .filter(row => row.user_id !== null)
      .map(row => ({
        id: row.user_id,
        name: row.name,
        email: row.email,
      }));

    return event;
  }

  
async registerUser(eventId, userId) {
  return sequelize.transaction(async (t) => {

    const [event] = await sequelize.query(
      `SELECT * FROM events WHERE id = :eventId`,
      {
        replacements: { eventId },
        transaction: t,
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!event) throw new Error('Event not found');

 
    if (new Date(event.dateTime) < new Date()) {
      throw new Error('Cannot register for past events');
    }

 
    const [exists] = await sequelize.query(
      `SELECT 1 FROM registrations
       WHERE "eventId" = :eventId AND "userId" = :userId`,
      {
        replacements: { eventId, userId },
        transaction: t,
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (exists) {
      throw new Error('User already registered for this event');
    }

   
    const [{ count }] = await sequelize.query(
      `SELECT COUNT(*)::int AS count FROM registrations WHERE "eventId" = :eventId`,
      {
        replacements: { eventId },
        transaction: t,
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (count >= event.capacity) {
      throw new Error('Event has reached maximum capacity');
    }

 
    await sequelize.query(
      `INSERT INTO registrations ("eventId", "userId")
       VALUES (:eventId, :userId)`,
      {
        replacements: { eventId, userId },
        transaction: t,
        type: sequelize.QueryTypes.INSERT,
      }
    );
  });
}


 
 async cancelRegistration(eventId, userId) {
  const [affectedCount] = await sequelize.query(
    `DELETE FROM registrations
     WHERE "eventId" = :eventId AND "userId" = :userId`,
    {
      replacements: { eventId, userId },
    
    }
  );


  if (affectedCount === 0) {
    throw new Error('Registration not found');
  }
}


  
  // async listUpcomingEvents() {
  //   const now = new Date();

  //   const events = await sequelize.query(
  //     `SELECT e.id, e.title, e."dateTime", e.location, e.capacity,
  //             COUNT(r."userId") AS "registeredCount"
  //      FROM events e
  //      LEFT JOIN registrations r ON e.id = r."eventId"
  //      WHERE e."dateTime" > :now
  //      GROUP BY e.id
  //      ORDER BY e."dateTime" ASC, e.location ASC`,
  //     {
  //       replacements: { now },
  //       type: sequelize.QueryTypes.SELECT,
  //     }
  //   );

  //   return events.map(event => ({
  //     ...event,
  //     registeredCount: parseInt(event.registeredCount),
  //   }));
  // }


  async getEventStats(eventId) {
  const [event] = await sequelize.query(
    `SELECT e.id, e.capacity, COUNT(r."userId") AS "registeredCount"
     FROM events e
     LEFT JOIN registrations r ON e.id = r."eventId"
     WHERE e.id = :eventId
     GROUP BY e.id`,
    {
      replacements: { eventId },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  if (!event) {
    throw new Error('Event not found');
  }

  const registered = parseInt(event.registeredCount || 0, 10);
  const remaining = event.capacity - registered;
  const percentage = Math.round((registered / event.capacity) * 100);

  return {
    totalRegistrations: registered,
    remainingCapacity: remaining,
    percentageUsed: `${percentage}%`,
  };
}}


module.exports = new EventService();
