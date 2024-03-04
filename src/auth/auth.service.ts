import { Injectable } from '@nestjs/common';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { UsersService } from '../modules/users/users.service';
import { UserType } from 'src/core/constants';
import { UserAuthDto } from 'src/modules/users/dto/user.dto';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  private readonly resources: any[];
  constructor(private readonly userService: UsersService) {}
  firebase() {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    };

    firebase.initializeApp(firebaseConfig);
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
  }
  async register(UserData: UserAuthDto) {
    this.firebase();
    const { email, password } = UserData;

    try {
      const user = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      const new_user = {
        email: user.user.email,
        uid: user.user.uid,
        user_type: UserType.USER,
      };
      await this.userService.create(new_user);
      const token = await user.user.getIdToken();
      return {
        email: user.user.email,
        token,
        status: 201,
      };
    } catch (e) {
      console.log('Failed with error code: ${e.code}');
      return {
        status: 401,
        message: e.message,
        error: true,
      };
    }
  }
  async login(UserData: UserAuthDto) {
    this.firebase();
    const { email, password } = UserData;
    const saved_user = await this.userService.findOneByEmail(email);

    if (!saved_user) {
      return {
        status: 401,
        message: 'Invalid Credentials',
        error: true,
      };
    }

    const user = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    //stuff fix this
    if (!user) {
      return {
        status: 401,
        message: 'Invalid Credentials',
        error: true,
      };
    }

    //stuff encrypt token

    const token = await user.user.getIdToken();

    return {
      token,
      user: saved_user,
    };
  }

  async admin_register(UserData: UserAuthDto) {
    this.firebase();
    const { email, password } = UserData;

    try {
      const user = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      const new_user = {
        email: user.user.email,
        uid: user.user.uid,
        user_type: UserType.ADMIN,
      };
      await this.userService.create(new_user);
      const token = await user.user.getIdToken();
      return {
        email: user.user.email,
        token,
        status: 201,
      };
    } catch (e) {
      console.log('Failed with error code: ${e.code}');
      return {
        status: 401,
        message: e.message,
        error: true,
      };
    }
  }
}
