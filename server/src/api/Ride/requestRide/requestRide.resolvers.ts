import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import { RequestRideResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import { authMiddleware, makeMiddleware } from "../../../utils/middlewares";

interface IArgs {
  pickUpLocation: string;
  dropOffLocation: string;
  pickUpLat: number;
  pickUpLng: number;
  dropOffLat: number;
  dropOffLng: number;
  price: number;
  distance: string;
  duration: string;
}

const resolvers: Resolvers = {
  Mutation: {
    requestRide: makeMiddleware(
      authMiddleware,
      async (_, args: IArgs, { req, pubsub }): Promise<RequestRideResponse> => {
        const { user }: { user: User } = req;
        if (user.isRiding) {
          return {
            ok: false,
            error: "Can't order two rides at once",
            ride: null
          };
        }
        const ride: Ride = await Ride.create({
          passenger: user,
          ...args
        }).save();
        user.currentRideId = ride.id;
        user.isRiding = true;
        user.save();
        pubsub.publish("newRide", { rideRequest: ride });
        if (ride) {
          return {
            ok: true,
            ride,
            error: null
          };
        } else {
          return {
            ok: false,
            ride: null,
            error: "Could not request a ride right now, please try later."
          };
        }
      }
    )
  }
};
export default resolvers;
