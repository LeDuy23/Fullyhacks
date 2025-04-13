
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { blurImage } from './blurImage';
import { estimateValue } from './estimateValue';
import { promptSuggestions } from './promptSuggestions';

// Initialize the Firebase Admin SDK
admin.initializeApp();

// Export the Cloud Functions
export const getItemSuggestions = functions.https.onCall(promptSuggestions);
export const getEstimatedValue = functions.https.onCall(estimateValue);
export const processAndBlurImage = functions.storage.object().onFinalize(blurImage);
