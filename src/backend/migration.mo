import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Iter "mo:core/Iter";

module {
  type OldRegistrant = {
    id : Text;
    name : Text;
    email : Text;
    skillLevel : Text;
    interests : [Text];
  };

  type NewRegistrant = {
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

  type OldActor = {
    registrants : Map.Map<Principal, OldRegistrant>;
    userProfiles : Map.Map<Principal, { name : Text }>;
    userBadges : Map.Map<Principal, { principal : Principal; uniqueId : Text; badge : Text }>;
  };

  type NewActor = {
    registrants : Map.Map<Principal, NewRegistrant>;
    userProfiles : Map.Map<Principal, { name : Text }>;
    userBadges : Map.Map<Principal, { principal : Principal; uniqueId : Text; badge : Text }>;
  };

  public func run(old : OldActor) : NewActor {
    let newRegistrants = old.registrants.map<Principal, OldRegistrant, NewRegistrant>(
      func(_principal, oldRegistrant) {
        {
          oldRegistrant with
          facebook = null;
          instagram = null;
          telegram = null;
          website = null;
          cryptoAddress = null;
        };
      }
    );
    {
      old with
      registrants = newRegistrants;
    };
  };
};
