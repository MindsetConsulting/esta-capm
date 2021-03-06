namespace sap.ui.estacapm;
using { managed } from '@sap/cds/common';

  entity Employees : managed {
    key ID         : UUID @(Core.Computed);
    fullName       : String(100);
    department     : String(100);
    title          : String(100);
    role           : String(100);
    industries     : String(100);
    directReport   : String(100);
    startDate      : Date;
    email          : String(100);
    skills         : Association to many Employee2Skill on skills.employee = $self;
  }

  entity Skills : managed {
    key ID       : UUID @(Core.Computed);
    skillTitle   : String(100);
    skillType    : String(100);
    institution  : String(100);
    employees    : Association to many Employee2Skill on employees.skill = $self;
  }

  entity Employee2Skill : managed {
      key ID   : UUID @(Core.Computed);
      skill    : Association to one Skills;
      employee : Association to one Employees @assert.integrity: false;
      dateAcquired : Date;
      renewal      : Renewal;
      comfortLevel : ComfortLevel;
  }

  type ComfortLevel : String enum {
    Beginner; Intermediate; Advanced; Expert
  }

  type Renewal : String enum {
    na;Current;Expired
  }