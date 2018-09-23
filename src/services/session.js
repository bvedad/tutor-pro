function Session($cookies) {
    this.create = (user) => {
      var expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 1);
      $cookies.putObject('Session', {
        email: user.email,
        token: user.token,
        username: user.username
      },
      {
        'expires': expireDate
      });
    };

    this.get = () => {
      return $cookies.getObject('Session');
    }

    this.destroy = () => {
      $cookies.remove('Session');
    };
}