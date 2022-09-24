const jwt = require("jsonwebtoken");
const IssuesToken = (newUser, res) =>{
    //Create JWT Payload And Issues JWT
    const payload = {
        user: {
          id: newUser.id,
        },
      };
      jwt.sign(
        payload,
        process.env.TOKEN_SECRET,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            success: true,
            token,
            user: {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
            },
          });
        }
      );
}

module.exports = IssuesToken;