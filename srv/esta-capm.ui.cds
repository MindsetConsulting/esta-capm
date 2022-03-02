using EstaCapm as service from './esta-capm';

annotate service.Employees with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : fullName,
            Label : 'Name',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : department,
            Label : 'Department',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : title,
            Label : 'Title',
            ![@UI.Importance] : #High,
        },
    ],
    UI.HeaderInfo: {
			TypeName: 'Employee',
			TypeNamePlural: 'Employees',
			Title          : {
                $Type : 'UI.DataField',
                Value : fullName
            },
			Description : {
				$Type: 'UI.DataField',
				Value: department
			}
		},
    UI.Facets: [
			{$Type: 'UI.ReferenceFacet', Label: 'General Information', Target: '@UI.FieldGroup#Main'},
            {$Type: 'UI.ReferenceFacet', Label: 'Skills', Target: 'skills/@UI.LineItem'}
		],
    UI.FieldGroup#Main: {
        Data: [
            {
                Value: department, 
                Label: 'Department'
            },
            {
                Value: title,
                Label: 'Title'
            },
            {
                Value: role,
                Label: 'Role'
            },
            {
                Value: directReport,
                Label: 'Direct Report'
            },
            {
                Value: startDate,
                Label: 'Start Date'
            },
            {
                Value: email,
                Label: 'Email'
            }
        ]
    }
);

annotate service.Employee2Skill with @(
    UI.LineItem: [
        {
            $Type : 'UI.DataField',
            Value : skill.skillTitle,
            Label : 'Skill',
            ![@UI.Importance] : #High,
            ![@Common.FieldControl] : #ReadOnly
        },
        {
            $Type : 'UI.DataField',
            Value : skill.institution,
            Label : 'Institution',
            ![@UI.Importance] : #High,
            ![@Common.FieldControl] : #ReadOnly
        },
        {
            $Type : 'UI.DataField',
            Value : skill.skillType,
            Label : 'Type of Skill',
            ![@UI.Importance] : #High,
            ![@Common.FieldControl] : #ReadOnly
        },
        {
            $Type : 'UI.DataField',
            Value : dateAcquired,
            Label : 'Date Acquired',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : comfortLevel,
            Label : 'Comfort Level',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : renewal,
            Label : 'Renewal Status',
            ![@UI.Importance] : #High,
        },
    ],
    UI.HeaderInfo: {
			TypeName: 'Skill',
			TypeNamePlural: 'Skill',
			Title          : {
                $Type : 'UI.DataField',
                Value : skill.skillTitle
            },
			Description : {
				$Type: 'UI.DataField',
				Value: dateAcquired
			}
		},
    UI.Facets: [
			{$Type: 'UI.ReferenceFacet', Label: 'Skill Information', Target: '@UI.FieldGroup#Detail'},
		],
    UI.FieldGroup#Detail: {
        Data: [
            {
                Value: skill.institution, 
                Label: 'Institution',
                ![@Common.FieldControl] : #ReadOnly
            },
            {
                Value: skill.skillType,
                Label: 'Type of Skill',
                ![@Common.FieldControl] : #ReadOnly
            },
            {
                Value: dateAcquired,
                Label: 'Date Acquired',
            },
            {
                Value: comfortLevel,
                Label: 'Comfort Level',
            },
            {
                Value: renewal,
                Label: 'Renewal Status'
            }
        ]
    }
);
