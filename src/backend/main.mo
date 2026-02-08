import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

// Live implementation, already deployed to the IC
// Add migration clause:
(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Registrant = {
    id : Text;
    name : Text;
    email : Text;
    skillLevel : Text;
    interests : [Text];
    facebook : ?Text;
    instagram : ?Text;
    telegram : ?Text;
    website : ?Text;
    cryptoAddress : ?Text;
  };

  public type UserProfile = {
    name : Text;
  };

  public type UserBadge = {
    principal : Principal;
    uniqueId : Text;
    badge : Text;
  };

  let registrants = Map.empty<Principal, Registrant>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userBadges = Map.empty<Principal, UserBadge>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addRegistrant(registrant : Registrant) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register");
    };
    registrants.add(caller, registrant);
  };

  public query ({ caller }) func getRegistrant(principal : Principal) : async ?Registrant {
    if (caller != principal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own registrant data");
    };
    registrants.get(principal);
  };

  public shared ({ caller }) func deleteRegistrant(principal : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete registrants");
    };
    if (not registrants.containsKey(principal)) {
      Runtime.trap("Registrant does not exist");
    };
    registrants.remove(principal);
  };

  public query ({ caller }) func listAllRegistrants() : async [Registrant] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can list registrants");
    };
    registrants.values().toArray();
  };

  public query ({ caller }) func searchRegistrants(searchTerm : Text) : async [Registrant] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can search registrants");
    };
    registrants.values().toArray().filter(
      func(registrant) {
        registrant.name.contains(#text searchTerm) or registrant.skillLevel.contains(#text searchTerm);
      }
    );
  };

  public shared ({ caller }) func getOrCreateUserBadge() : async UserBadge {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get badges");
    };
    switch (userBadges.get(caller)) {
      case (?existingBadge) { existingBadge };
      case (null) {
        let uniqueId = "user-" # (userBadges.size() + 1).toText();
        let badge = "badge-" # uniqueId;
        let newUserBadge : UserBadge = {
          principal = caller;
          uniqueId;
          badge;
        };
        userBadges.add(caller, newUserBadge);
        newUserBadge;
      };
    };
  };

  public query ({ caller }) func getUserBadge(principal : Principal) : async ?UserBadge {
    if (caller != principal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own badge");
    };
    userBadges.get(principal);
  };

  // New API for Digital World to get total number of registrants
  public query ({ caller }) func getTotalNumberOfRegistrants() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view registrant count");
    };
    registrants.size();
  };
};
