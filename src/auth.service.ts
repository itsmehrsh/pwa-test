import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private serverUrl = 'http://localhost:8080'; // Update with your backend URL

  async register() {
    const challenge = new Uint8Array(32);
    const userId = new Uint8Array(16); // Unique user ID

    // Generate random values
    window.crypto.getRandomValues(challenge);
    window.crypto.getRandomValues(userId);

    const publicKey: PublicKeyCredentialCreationOptions = {
      challenge: challenge,
      rp: {
        name: 'Your App Name',
      },
      user: {
        id: userId,
        name: 'user@example.com',
        displayName: 'User Name',
      },
      pubKeyCredParams: [
        {
          type: 'public-key',
          alg: -7, // ECDSA with SHA-256
        },
      ],
      timeout: 60000,
      attestation: 'direct',
    };

    try {
      const credential = await navigator.credentials.create({ publicKey });
      // Send the credential to the server for verification and storage
      const response = await fetch(`${this.serverUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'unique-user-id', credential }),
      });
      const result = await response.json();
      console.log('Registration successful', result);
    } catch (error) {
      console.error('Registration failed', error);
    }
  }

  async login() {
    const challenge = new Uint8Array(32); // Replace with a secure random value from the server

    // Fetch the login options from the server
    const optionsResponse = await fetch(`${this.serverUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'unique-user-id' }),
    });

    const options = await optionsResponse.json();

    // Assume that `options.challenge` is a Uint8Array that you receive from the server
    const serverChallenge = new Uint8Array(options.challenge); // Ensure it's a typed array

    const publicKey: PublicKeyCredentialRequestOptions = {
      challenge: serverChallenge,
      allowCredentials: [
        {
          id: new Uint8Array(options.credentialId), // Credential ID from the server
          type: 'public-key',
        },
      ],
      timeout: 60000,
    };

    try {
      const assertion = await navigator.credentials.get({ publicKey });
      // Send the assertion to the server for verification
      const response = await fetch(`${this.serverUrl}/verify-authentication`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'unique-user-id', assertion }),
      });
      const result = await response.json();
      console.log('Login successful', result);
    } catch (error) {
      console.error('Login failed', error);
    }
  }
}
