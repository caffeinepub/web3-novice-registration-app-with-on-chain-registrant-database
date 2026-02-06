import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type Registrant = {
    id : Text;
    name : Text;
    email : Text;
    skillLevel : Text;
    interests : [Text];
  };

  type UserProfile = {
    name : Text;
  };

  type UserBadge = {
    principal : Principal;
    uniqueId : Text;
    badge : Text;
  };

  type OldActor = {
    registrants : Map.Map<Principal, Registrant>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  type NewActor = {
    registrants : Map.Map<Principal, Registrant>;
    userProfiles : Map.Map<Principal, UserProfile>;
    userBadges : Map.Map<Principal, UserBadge>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserBadges = Map.empty<Principal, UserBadge>();
    {
      old with
      userBadges = newUserBadges
    };
  };
};
