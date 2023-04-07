import profileRoute from './profile/routes.js';
import siteRoutes from './site/routes.js';
import batchRoutes from './batch/routes.js'
import contractorRoutes from './contractor/routes.js';
import distributorCylinderRoutes from './distributorCylinder/routes.js'
import dailyscanRoutes from './dailyScan/routes.js'
export default [
    ...profileRoute,
    ...contractorRoutes,
    ...siteRoutes,
    ...batchRoutes,
    ...distributorCylinderRoutes,
    ...dailyscanRoutes
]