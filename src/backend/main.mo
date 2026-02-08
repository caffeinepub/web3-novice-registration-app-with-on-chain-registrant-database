import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Sector = {
    #marchand;
    #association;
    #professionLiberal;
    #services;
    #fonctionnaire;
    #artiste;
    #sportif;
    #etudiant;
    #aucuneActivite;
  };

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
    isPublic : Bool;
    sector : Sector;
  };

  public type PublicRegistrant = {
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
    sector : Sector;
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

  // Public API: Returns only public registrants for a specific sector or all sectors
  // No authentication required - this is intentionally public data
  public query func getPublicRegistrantsBySector(optSector : ?Sector) : async [PublicRegistrant] {
    let allValues = registrants.values().toArray();
    let publicValues = allValues.filter(
      func(registrant) {
        if (not registrant.isPublic) { false } else {
          switch (optSector) {
            case (null) { true };
            case (?sector) { registrant.sector == sector };
          };
        };
      }
    );
    publicValues.map<Registrant, PublicRegistrant>(
      func(r) {
        {
          id = r.id;
          name = r.name;
          email = r.email;
          skillLevel = r.skillLevel;
          interests = r.interests;
          facebook = r.facebook;
          instagram = r.instagram;
          telegram = r.telegram;
          website = r.website;
          cryptoAddress = r.cryptoAddress;
          sector = r.sector;
        };
      }
    );
  };

  // DEPRECATED: Only for legacy compatibility, should not be used for public listings
  public query ({ caller }) func getTotalNumberOfRegistrants() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view registrant count");
    };
    registrants.size();
  };

  // Public API: Get count of public registrants by sector
  // No authentication required - this is intentionally public data
  public query func getPublicRegistrantsCountBySector(optSector : ?Sector) : async Nat {
    var count = 0;
    for ((_, r) in registrants.entries()) {
      if (r.isPublic) {
        switch (optSector) {
          case (null) { count += 1 };
          case (?sector) {
            if (r.sector == sector) { count += 1 };
          };
        };
      };
    };
    count;
  };
};
