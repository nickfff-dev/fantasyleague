class SessionStore {
  findSession(id) {}
  saveSession(id, session) {}
  findAllSessions() { }
}



class InMemorySessionStore extends SessionStore {
  constructor() {
    super();
    this.sessions = new Map();
  }

  findSession(id) {
    return this.sessions.get(id);
  }

  saveSession(id, session) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }

  updateSession(id) {

    const session = this.sessions.get(id);
    if (session) { 
      session.isReady = true;
    }

   }



  


}


module.exports = {
  InMemorySessionStore
};
