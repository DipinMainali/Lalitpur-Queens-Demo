// "use server";
// import dbConnection from "@/utils/dbconnection";
// import Sponser from "@/models/player.model";

// export async function createSponser(formData) {
//   try {
//     await dbConnection();
//     const sponser = new Sponser({
//       name: formData.name,
//       logo: formData.logo,
//       website: formData.website,
//       tier: formData.tier,
//     });
//     await sponser.save();
//     console.log("Sponser created successfully");
//   } catch (error) {
//     console.log(error);
//     console.log("Sponser creation failed");
//   }
// }
