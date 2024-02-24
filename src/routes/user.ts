import 'dotenv/config'
import { NextFunction, Request, Response, Router } from "express";
import { urlencoded } from "body-parser";
import { ROLES } from "../config/roles";
import { EmailerFactory } from "../factories/emailer-factory";
import { ForgottenPasswordToken } from "../schema/schemas";
// import { Association, ForgottenPasswordToken } from "../schema/schemas";
import User, { UserSchema } from "../schema/user";


// import { bugsnagClient } from "../config/bugsnag";
// import Mail = require("nodemailer/lib/mailer");
// import Mail from "nodemailer/lib/mailer"
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import checkAuth from "../middleware/check-auth";
import { HomeOwnerAssociation } from '../schema/home-owner-association';

const secret = process.env.SECRET ?? "";
export class UserRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  init() {
    this.router.post("/login/", this.login);
    this.router.post("/register/", this.register);
    this.router.get("/forgotten/", this.forgotten);
    this.router.post("/forgotten/", this.changeForgottenPassword);
    // this.router.get("/associations", checkAuth, this.getUserAssociations);
    // this.router.post("/associations", checkAuth, this.setCurrentAssociation);
    this.router.get("/loggedInUser", checkAuth, this.getloggedInUser);
  }

  public login(req: Request, res: Response, next: NextFunction) {
    var fetchedUser: User;
    var initialId: number;
    var initialAssociationName: string;
    console.log("login route hit");

    User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: "Auth Failed - Status 1" });
        }
        fetchedUser = user;
        // returns a bool true/false for pass/fail
        return true //user.comparePassword(req.body.password);
      })
      .then((result) => {
        if (!result) {
          return res.status(401).json({ message: "Auth Failed - Status 2" });
        }
        // set the association upon successful login
        fetchedUser
          .getAvailableAssociations()
          .then((associationsAvailable: HomeOwnerAssociation[] | undefined) => {
            if(associationsAvailable){
                initialId = associationsAvailable?.[0]?.id, 
                initialAssociationName = associationsAvailable?.[0]?.name
            }
          })
          .then(() => {
            // create the token to send to the client
            const token = jwt.sign(
              { email: fetchedUser.email, userId: fetchedUser.id },
              secret,
              { expiresIn: "1h" }
            );
            res.status(200).json({
              token: token,
              user: {id: fetchedUser.id},
              association: {
                id: initialId,
                name: initialAssociationName,
              },
              expiresIn: "3600", // 1h in seconds, sent back to the client
            });
          });
      })
      .catch((err) => {
        console.log("Error logging in: " + err);
        return res.status(401).json({ message: "Auth Failed - Status 3" });
      });
  }

  public getloggedInUser(req: Request, res: Response, next: NextFunction) {
    var fetchedUser: User;
    const byUserId = parseInt(<string>req.query.userId).valueOf();
    User.findOne({
      where: {
        id: byUserId,
      },
    }).then((user) => {
      // res.status(200).json({ userFirstName: user?.firstName });
    });
  }

  public register(req: Request, res: Response, next: NextFunction) {
    const newUser = new UserSchema(req.body);
    newUser
      .save()
      .then((data) => {
        res.send(newUser);
      })
      .catch((error) => {
        // bugsnagClient.notify(error);
        res.sendStatus(500);
      });
  }

  // private getUserAssociations(req: Request, res: Response, next: NextFunction) {
  //   const byUserId = parseInt(<string>req.query.userId).valueOf();
  //   console.log("user id get user associations is " + byUserId);
  //   User.findOne({
  //     where: {
  //       id: byUserId,
  //     },
  //   }).then((user) => {
  //     user
  //       ?.getAvailableAssociations()
  //       .then((associations) => {
  //         res.send({
  //           associations,
  //           // currentAssociation: req.session.hoaId,
  //         });
  //       })
  //       .catch((error) => {
  //         // bugsnagClient.notify(error);
  //         res.sendStatus(500);
  //       });
  //   });
  // }

  // private async setCurrentAssociation(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   const hoaId: number = parseInt(req.body.hoaId, 10);
  //   const byUserId = parseInt(<string>req.query.userId).valueOf();
  //   User.findOne({
  //     where: {
  //       id: byUserId,
  //     },
  //   }).then((fetchedUser) => {
  //     fetchedUser
  //       ?.getAvailableAssociations()
  //       .then((associations) => {
  //         if (
  //           !associations.some(
  //             (association) => association.id === hoaId
  //           )
  //         ) {
  //           return res.sendStatus(403);
  //         }
  //         res.send({
  //           associations,
  //           currentAssociation: hoaId,
  //         });
  //       })
  //       .catch((error) => {
  //         // bugsnagClient.notify(error);
  //         res.sendStatus(500);
  //       });
  //   });
  // }

  private forgotten(req: Request, res: Response, next: NextFunction) {
    const email = <string>req.query.email;
    const domain = process.env.NODE_ENV === "staging" ? process.env.HOA_STAGING_DOMAIN : process.env.HOA_PROD_DOMAIN
    const byUserId = parseInt(<string>req.query.userId).valueOf();
    User.findOne({
      where: { email },
    })
      .then((user) => {
        const token = new ForgottenPasswordToken(
          // { userId: user.id } TODO: fix 
          );
        return token.save();
      })
      .then((token) => {
        const emailer = EmailerFactory.createEmailer();
        const mailOptions: nodemailer.SendMailOptions = {
          from: process.env.FROM_EMAIL,
          to:
            process.env.NODE_ENV === "development"
              ? process.env.DEVELOPER_EMAIL
              : (email as string),
          subject: "HOA Director | Password Reset",
          text: `
        A new password has been requested for ${email}.
        To reset your password use the following link: https://${domain}/forgotten-password/${token.token}
        `,
          html: `
        <p>A new password has been requested for ${email}.</p>
        <p>To reset your password click <a href="https://${domain}/forgotten-password/${token.token}">here</a></p>
        <p>or use the following link: https://${domain}/forgotten-password/${token.token}</p>
        `,
        };
        return emailer.sendMail(mailOptions);
      })
      .then(() => {
        res.send({ success: true });
      })
      .catch((error) => {
        // bugsnagClient.notify(error);
        res.status(500).send({ success: false });
        console.log("Error resetting password: " + error);
      });
  }

  private changeForgottenPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const password = req.body.password;
    const token = req.body.token;
    User.findOne({
      include: [
        {
          model: ForgottenPasswordToken,
          as: "tokens",
          where: {
            token,
          },
        },
      ],
    })
      .then((user) => {
        return user?.changePassword(password);
      })
      .then((user: any) => {
        return user?.tokens[0].destroy();
      })
      .then(() => {
        res.send({ success: true });
      })
      .catch((error) => {
        // bugsnagClient.notify(error);
        res.status(500).send({ success: false });
      });
  }
}

const userRoutes = new UserRouter().router;
export default userRoutes;
