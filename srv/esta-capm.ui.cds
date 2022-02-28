using EstaCapm as service from './esta-capm';

annotate service.Employees with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : fullName,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : department,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : title,
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
			{$Type: 'UI.ReferenceFacet', Label: 'Main', Target: '@UI.FieldGroup#Main'},
            {$Type: 'UI.ReferenceFacet', Label: 'Skills', Target: 'skills/@UI.LineItem'}
		],
    UI.FieldGroup#Main: {
        Data: [
            {Value: ID},
            {
                Value: title
            },
            {
                Value: email
            }
        ]
    }
);

annotate service.Employee2Skill with @(
    UI.LineItem: [
        {
            $Type : 'UI.DataField',
            Value : skill.skillTitle,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : skill.institution,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : skill.skillType,
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : comfortLevel,
            ![@UI.Importance] : #High,
        },
    ]
);
