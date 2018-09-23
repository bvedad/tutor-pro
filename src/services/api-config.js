function ApiConfig(Session) {
    this.get = () => {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + (Session.get() ? Session.get().token : '')
            }
        }
    }
}