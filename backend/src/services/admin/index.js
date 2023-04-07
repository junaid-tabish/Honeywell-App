import batchRoutes from './batch/routes.js'
import profileRoute from './profile/route.js'
import distributorRoutes from './distributor/routes.js'
import contractorRoutes from './contractor/routes.js'
import siteRoutes from './site/routes.js';
import cylindersRoutes from './cylinder/routes.js'
import assetTrackingRoutes from './Asset tracking/routes.js'
import noticationRoutes from './notification/routes.js'

export default [
    ...batchRoutes,
    ...profileRoute,
    ...distributorRoutes,
    ...contractorRoutes,
    ...siteRoutes,
    ...cylindersRoutes,
    ...assetTrackingRoutes,
    ...noticationRoutes
]