import profileRoute from './profile/routes.js';
import cylinderRoute from './contractorCylinder/routes.js';
import dailyScanRoute from './dailyscan/routes.js';

export default [
    ...profileRoute,
    ...cylinderRoute,
    ...dailyScanRoute
]