using { sap.ui.estacapm as my } from '../db/schema';
@path: 'service/esta'
service EstaCapm {
  entity Employees as projection on my.Employees;
    annotate Employees with @odata.draft.enabled;
  entity Skills as projection on my.Skills;
    annotate Skills with @odata.draft.enabled;
  entity Employee2Skill as projection on my.Employee2Skill;
    annotate Employee2Skill with @odata.draft.enabled;
}