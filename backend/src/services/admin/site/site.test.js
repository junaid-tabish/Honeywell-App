import { getActiveSites } from './controller';
import UserModel from "../../../models/user.js";
import {
    PAGE_LIMIT,
    USER_CONTRACTOR,
    USER_DISTRIBUTOR,
  } from "../../../utils/constant.js";
  import SiteModel from "../../../models/site.js";
  import { APIResponse } from "../../../utils/common.js";
// Mocking the required dependencies
jest.mock('../../../models/site.js');
jest.mock('../../../models/user.js');
jest.mock('../../../models/notification.js');
jest.mock('../../../utils/common.js');
jest.mock('../../../utils/constant.js');
jest.mock('jsonwebtoken');

describe('getActiveSites', () => {
  const req = {
    params: {
      id: '1234567890'
    }
  };
  const res = {
    send: jest.fn()
  };

  it('should return active sites for distributor', async () => {
    // Mocking UserModel.findOne method to return distributor details
    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce({
      role: USER_DISTRIBUTOR
    });

    // Mocking SiteModel.aggregate method to return active sites not assigned to distributor
    jest.spyOn(SiteModel, 'aggregate').mockResolvedValueOnce([{ id: 'site1' }, { id: 'site2' }]);

    await getActiveSites(req, res);

    // Expect the response to have a success status code and the active sites
    expect(res.send).toHaveBeenCalledWith(new APIResponse(1, 'Data found', getActiveSites));
  });

  it('should return active sites for contractor', async () => {
    // Mocking UserModel.findOne method to return contractor details
    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce({
      role: USER_CONTRACTOR
    });

    // Mocking SiteModel.aggregate method to return active sites not assigned to contractor
    jest.spyOn(SiteModel, 'aggregate').mockResolvedValueOnce([{ id: 'site3' }, { id: 'site4' }]);

    await getActiveSites(req, res);

    // Expect the response to have a success status code and the active sites
    expect(res.send).toHaveBeenCalledWith(new APIResponse(1, 'Data found', getActiveSites));
  });

  it('should return no details found for unknown user role', async () => {
    // Mocking UserModel.findOne method to return user details with unknown role
    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce({
      role: 'unknown'
    });

    await getActiveSites(req, res);

    // Expect the response to have an error status code and the "No details found" message
    expect(res.send).toHaveBeenCalledWith(new APIResponse(0, 'No details found'));

  });

  it('should return no details found when sites are not found', async () => {
    // Mocking UserModel.findOne method to return distributor details
    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce({
      role: USER_DISTRIBUTOR
    });

    // Mocking SiteModel.aggregate method to return no sites
    jest.spyOn(SiteModel, 'aggregate').mockResolvedValueOnce([]);

    await getActiveSites(req, res);

    // Expect the response to have an error status code and the "No details found" message
    expect(res.send).toHaveBeenCalledWith(new APIResponse(0, 'No details found'));

  });
});
// ----------------------------------------------------------
// // Test case for delete site
// import { deleteData } from "./controller";
// import siteModel from "../../../models/site.js";
// import { APIResponse } from "../../../utils/common.js";

// // Mock siteModel to return a site with isAssignedToContractor and isAssignedToDistributor as 0
// jest.mock("../../../models/site.js", () => ({
//   findOne: jest.fn().mockResolvedValue({
//     isAssignedToContractor: "0",
//     isAssignedToDistributor: "0",
//   }),
//   findByIdAndDelete: jest.fn(),
// }));

// describe("deleteData function", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it("should delete site if it is not assigned to any contractor or distributor", async () => {
//     const req = { params: { id: "123" } };
//     const res = {
//       send: jest.fn().mockReturnValue(new APIResponse(1, "Deleted")),
//     };

//     await deleteData(req, res);

//     expect(siteModel.findOne).toHaveBeenCalledWith({ _id: "123" });
//     expect(siteModel.findByIdAndDelete).toHaveBeenCalledWith({ _id: "123" });
//     expect(res.send).toHaveBeenCalledWith(new APIResponse(1, "Deleted"));
//   });

//   it("should not delete site if it is assigned to a contractor or distributor", async () => {
//     siteModel.findOne.mockResolvedValueOnce({
//       isAssignedToContractor: "1",
//       isAssignedToDistributor: "0",
//     });

//     const req = { params: { id: "123" } };
//     const res = {
//       send: jest.fn().mockReturnValue(new APIResponse(0, "Site is Alloted to someone")),
//     };

//     await deleteData(req, res);

//     expect(siteModel.findOne).toHaveBeenCalledWith({ _id: "123" });
//     expect(siteModel.findByIdAndDelete).not.toHaveBeenCalled();
//     expect(res.send).toHaveBeenCalledWith(new APIResponse(0, "Site is Alloted to someone"));
//   });

//   it("should send an error message if site id is not found", async () => {
//     siteModel.findOne.mockResolvedValueOnce(null);

//     const req = { params: { id: "123" } };
//     const res = {
//       send: jest.fn().mockReturnValue(new APIResponse(0, "Id not found")),
//     };

//     await deleteData(req, res);

//     expect(siteModel.findOne).toHaveBeenCalledWith({ _id: "123" });
//     expect(siteModel.findByIdAndDelete).not.toHaveBeenCalled();
//     expect(res.send).toHaveBeenCalledWith(new APIResponse(0, "Id not found"));
//   });
// });

// ------------------------------------------------------------------------------
// Test case for update site
// import siteModel from "../../../models/site.js";
// import { APIResponse } from "../../../utils/common.js";
// import { updateData } from "./controller";

// jest.mock("../../../models/site.js");

// describe("updateData", () => {
//   const req = {
//     params: { id: "test-id" },
//     body: {
//       siteName: "new-site",
//       status: "1",
//       longitude: 123.45,
//       latitude: 67.89,
//       isAssignedToContractor: 1,
//       isAssignedToDistributor: 0,
//     },
//   };
//   const res = {
//     send: jest.fn(),
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it("should update site data and return APIResponse with status 1", async () => {
//     siteModel.findOne.mockResolvedValue(null);
//     siteModel.updateOne.mockResolvedValue({ nModified: 1 });

//     await updateData(req, res);

//     expect(siteModel.findOne).toHaveBeenCalledWith({ siteName: "new-site" });
//     expect(siteModel.updateOne).toHaveBeenCalledWith(
//       { _id: "test-id" },
//       {
//         $set: {
//           siteName: "new-site",
//           status: "1",
//           longitude: 123.45,
//           latitude: 67.89,
//           isAssignedToContractor: 1,
//           isAssignedToDistributor: 0,
//         },
//       }
//     );
//     expect(res.send).toHaveBeenCalledWith(
//       new APIResponse(1, "Site updated successfully", { nModified: 1 })
//     );
//   });

//   it("should return APIResponse with status 0 if site name is already exist", async () => {
//     siteModel.findOne.mockResolvedValue({ _id: "other-id" });

//     await updateData(req, res);

//     expect(siteModel.findOne).toHaveBeenCalledWith({ siteName: "new-site" });
//     expect(siteModel.updateOne).not.toHaveBeenCalled();
//     expect(res.send).toHaveBeenCalledWith(
//       new APIResponse(0, "Site name is already exist.")
//     );
//   });

//   it("should return APIResponse with status 0 if site update fails", async () => {
//     siteModel.findOne.mockResolvedValue(null);
//     siteModel.updateOne.mockRejectedValue(new Error("database error"));

//     await updateData(req, res);

//     expect(siteModel.findOne).toHaveBeenCalledWith({ siteName: "new-site" });
//     expect(siteModel.updateOne).toHaveBeenCalledWith(
//       { _id: "test-id" },
//       {
//         $set: {
//           siteName: "new-site",
//           status: "1",
//           longitude: 123.45,
//           latitude: 67.89,
//           isAssignedToContractor: 1,
//           isAssignedToDistributor: 0,
//         },
//       }
//     );
//     expect(res.send).toHaveBeenCalledWith(
//       new APIResponse(0, "Error while updating")
//     );
//   });
// });

// --------------------------------------------------------------------------
// Test case for contractor dropdown
// import UserModel from "../../../models/user.js";
// import { APIResponse } from "../../../utils/common.js";
// import { getContractorsAllocatedToDistributor } from "./controller";

// jest.mock("../../../models/user.js");

// describe("getContractorsAllocatedToDistributor", () => {
//   it("should return a success response with data when data is found", async () => {
//     const mockRequest = {
//       params: {
//         id: "testId",
//       },
//     };

//     const mockResponse = {
//       send: jest.fn(),
//     };

//     const mockUserData = [
//       {
//         name: "John Doe",
//         email: "johndoe@test.com",
//         contractorId: "contractor1",
//       },
//     ];

//     UserModel.find.mockResolvedValueOnce(mockUserData);

//     await getContractorsAllocatedToDistributor(mockRequest, mockResponse);

//     expect(mockResponse.send).toHaveBeenCalledWith(
//       new APIResponse(1, "msg", mockUserData)
//     );
//   });

//   it("should return an error response when no data is found", async () => {
//     const mockRequest = {
//       params: {
//         id: "testId",
//       },
//     };

//     const mockResponse = {
//       send: jest.fn(),
//     };

//     UserModel.find.mockResolvedValueOnce(null);

//     await getContractorsAllocatedToDistributor(mockRequest, mockResponse);

//     expect(mockResponse.send).toHaveBeenCalledWith(
//       new APIResponse(0, "No details forunds")
//     );
//   });
// });

// -----------------------------------------------------------------------------------------------------
// Find All sites test cases
// import { APIResponse } from "../../../utils/common.js";
// import siteModel from "../../../models/site.js";
// import { PAGE_LIMIT } from "../../../utils/constant.js";
// import { findSites } from "./controller";

// // Mock siteModel
// jest.mock("../../../models/site.js", () => ({
//   find: jest.fn(),
// }));

// describe("findSites", () => {
//   it("should return APIResponse with sites if found", async () => {
//     // Create mock request and response objects
//     const req = {
//       query: {
//         page: "1",
//         search: "test",
//         sort: "createdAt",
//         order: "desc",
//       },
//     };
//     const res = {
//       send: jest.fn(),
//     };

//     // Mock siteModel.find() to return sites
//     const sites = [{ siteName: "test site" }];
//     siteModel.find.mockReturnValue({
//       populate: jest.fn().mockResolvedValue(sites),
//     });
//     // Call findSites with mock request and response objects
//     await findSites(req, res);

//     // Check that res.send() was called with the expected APIResponse
//     expect(res.send).toHaveBeenCalledWith(
//       new APIResponse(1, "Details found", sites)
//     );
//   });

//   it("should return APIResponse with error message if exception occurs", async () => {
//     // Create mock request and response objects
//     const req = {
//       query: {},
//     };
//     const res = {
//       send: jest.fn(),
//     };

//     // Mock siteModel.find() to throw an exception
//     siteModel.find.mockImplementation(() => {
//       throw new Error("Test error");
//     });

//     // Call findSites with mock request and response objects
//     await findSites(req, res);

//     // Check that res.send() was called with the expected APIResponse
//     expect(res.send).toHaveBeenCalledWith(
//       new APIResponse(0, "Exception Occurs:", { error: "Test error" })
//     );
//   });
// });

// ----------------------------------------------------------------------------------------------------
// Test case for Add site

// import { addData } from './';
// import siteModel from "../../../models/site.js";
// import UserModel from "../../../models/user.js";
// import NotificationModel from "../../../models/notification.js";
// import jwt from "jsonwebtoken";

// jest.mock('../../../models/site.js');
// jest.mock('../../../models/user.js');
// jest.mock('../../../models/notification.js');
// jest.mock('jsonwebtoken');

// describe('addData function', () => {
//   const req = {
//     body: {
//       siteName: 'testSite',
//       distributorId: 'distributorID',
//       contractorId: 'contractorID'
//     },
//     headers: {
//       authorization: 'Bearer your-jwt-token'
//     }
//   };

//   const res = {
//     send: jest.fn()
//   };

//   const siteDetails = {
//     _id: 'siteID',
//     siteName: 'testSite',
//     isAssignedToDistributor: 1,
//     isAssignedToContractor: 1
//   };

//   const user = {
//     _id: 'userID',
//     name: 'testUser'
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test('should return APIResponse with 0 and "Site is already exists" message if siteName already exists', async () => {
//     siteModel.findOne.mockResolvedValueOnce(siteDetails);
//     const expectedResponse = { status: 0, message: 'Site is already exists' };

//     await addData(req, res);

//     expect(siteModel.findOne).toHaveBeenCalledWith({ siteName: req.body.siteName });
//     expect(res.send).toHaveBeenCalledWith(expectedResponse);
//   });

//   test('should create a new site and update UserModel and NotificationModel if siteName does not exist', async () => {
//     siteModel.findOne.mockResolvedValueOnce(null);
//     siteModel.mockReturnValueOnce({ save: jest.fn().mockResolvedValueOnce(siteDetails) });
//     jwt.decode.mockReturnValueOnce({ userID: user._id });
//     UserModel.findOne.mockResolvedValueOnce(user);
//     UserModel.findByIdAndUpdate.mockResolvedValueOnce({});
//     NotificationModel.mockReturnValueOnce({ save: jest.fn().mockResolvedValueOnce({}) });
//     const expectedResponse = { status: 1, message: 'Site Successfully Added', data: siteDetails };

//     await addData(req, res);

//     expect(siteModel.findOne).toHaveBeenCalledWith({ siteName: req.body.siteName });
//     expect(siteModel).toHaveBeenCalledWith(req.body);
//     expect(jwt.decode).toHaveBeenCalledWith('your-jwt-token');
//     expect(UserModel.findOne).toHaveBeenCalledWith({ _id: user._id });
//     expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith({ _id: req.body.distributorId }, { $push: { assignedSites: siteDetails._id } });
//     expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith({ _id: req.body.contractorId }, { $push: { assignedSites: siteDetails._id } });
//     expect(NotificationModel).toHaveBeenCalledWith({ message: `site ${req.body.siteName} has been assigned to you by admin ${user.name}`, role: USER_DISTRIBUTOR, userId: req.body.distributorId });
//     expect(NotificationModel).toHaveBeenCalledWith({ message: `site ${req.body.siteName} has been assigned to you by admin ${user.name}`, role: USER_CONTRACTOR, userId: req.body.contractorId });
//     expect(res.send).toHaveBeenCalledWith(expectedResponse);
//   });

//   test('should return APIResponse with 0 and "Site Not Added" message if there is an error', async () => {
//     siteModel.findOne.mockRejectedValueOnce();
//     const expectedResponse = { status: 0, message: 'Site Not Added' };

//     await addData(req, res);

//     expect(siteModel.findOne).toHaveBeenCalledWith({ siteName: req.body.siteName });
//     expect(res.send).toHaveBeenCalledWith(expectedResponse);
//   });
// });
