<?php
// https://symfony.com/doc/2.8/templating/twig_extension.html
// https://www.php.net/manual/fr/datetime.format.php

namespace App\Twig;

use DateTime;
use Symfony\Component\HttpFoundation\Session\Session;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;
use App\Utils\Tool;
use App\Service\ApiConstant;
use App\Service\ApiDataService;

class AppExtension extends AbstractExtension
{
    // private $session;
    private $apiService;
    private $isoCountries;
    private $statutColors;

    public function __construct(ApiDataService $apiDataService)
    {
        $this->apiService = $apiDataService;
        // $this->session = new Session();
        // if (!$this->session->getId())
        //     $this->session->start();

        $this->statutColors = [
            // ApiConstant::SD_SAISIE_NON_TERMINEE => "#fd7e14",
            // ApiConstant::SD_SAISIE_TERMINEE => "#00A3FF",
            // ApiConstant::SD_EN_DOUBLON => "#dc3545",
            // ApiConstant::SD_NINA_NON_ATTRIBUE => "#051D89",
            // ApiConstant::SD_NINA_ATTRIBUE => "#50CD89",
            // ApiConstant::SD_NON_VISA_PARQUET => "#d63384",
            // ApiConstant::SD_VISA_PARQUET => "#A3FF00",
            // ApiConstant::SD_NON_CONFORME => "#F1416C",
            // ApiConstant::SD_CONFORME => "#20c997",
            // ApiConstant::SD_JUGEMENT_SUPPLETIF_FAIT => "#198754"
        ];

        $this->isoCountries = [
            array('id' => 'AF', 'text' => 'Afghanistan'),
            array('id' => 'AX', 'text' => 'Îles d\'Aland'),
            array('id' => 'AL', 'text' => 'Albanie'),
            array('id' => 'DZ', 'text' => 'Algérie'),
            array('id' => 'AS', 'text' => 'Samoa américaines'),
            array('id' => 'AD', 'text' => 'Andorre'),
            array('id' => 'AO', 'text' => 'Angola'),
            array('id' => 'AI', 'text' => 'Anguilla'),
            array('id' => 'AQ', 'text' => 'Antarctique'),
            array('id' => 'AG', 'text' => 'Antigua-et-Barbuda'),
            array('id' => 'AR', 'text' => 'Argentine'),
            array('id' => 'AM', 'text' => 'Armenia'),
            array('id' => 'AW', 'text' => 'Aruba'),
            array('id' => 'AU', 'text' => 'Australie'),
            array('id' => 'AT', 'text' => 'Autriche'),
            array('id' => 'AZ', 'text' => 'Azerbaïdjan'),
            array('id' => 'BS', 'text' => 'Bahamas'),
            array('id' => 'BH', 'text' => 'Bahreïn'),
            array('id' => 'BD', 'text' => 'Bangladesh'),
            array('id' => 'BB', 'text' => 'Barbade'),
            array('id' => 'BY', 'text' => 'Belarus'),
            array('id' => 'BE', 'text' => 'Belgique'),
            array('id' => 'BZ', 'text' => 'Belize'),
            array('id' => 'BJ', 'text' => 'Bénin'),
            array('id' => 'BM', 'text' => 'Bermudes'),
            array('id' => 'BT', 'text' => 'Bhoutan'),
            array('id' => 'BO', 'text' => 'Bolivie'),
            array('id' => 'BA', 'text' => 'Bosnie-Herzégovine'),
            array('id' => 'BW', 'text' => 'Botswana'),
            array('id' => 'BV', 'text' => 'Ile Bouvet'),
            array('id' => 'BR', 'text' => 'Brésil'),
            array('id' => 'IO', 'text' => 'Territoire britannique de l\'océan Indien'),
            array('id' => 'BN', 'text' => 'Brunei Darussalam'),
            array('id' => 'BG', 'text' => 'Bulgarie'),
            array('id' => 'BF', 'text' => 'Burkina Faso'),
            array('id' => 'BI', 'text' => 'Burundi'),
            array('id' => 'KH', 'text' => 'Cambodge'),
            array('id' => 'CM', 'text' => 'Cameroun'),
            array('id' => 'CA', 'text' => 'Canada'),
            array('id' => 'CV', 'text' => 'Cap-Vert'),
            array('id' => 'KY', 'text' => 'Cayman Islands'),
            array('id' => 'CF', 'text' => 'République centrafricaine'),
            array('id' => 'TD', 'text' => 'Tchad'),
            array('id' => 'CL', 'text' => 'Chili'),
            array('id' => 'CN', 'text' => 'Chine'),
            array('id' => 'CX', 'text' => 'Christmas Island'),
            array('id' => 'CC', 'text' => 'Cocos (Keeling) Islands'),
            array('id' => 'CO', 'text' => 'Colombie'),
            array('id' => 'KM', 'text' => 'Comores'),
            array('id' => 'CG', 'text' => 'Congo'),
            array('id' => 'CD', 'text' => 'Congo, République démocratique'),
            array('id' => 'CK', 'text' => 'Cook Islands'),
            array('id' => 'CR', 'text' => 'Costa Rica'),
            array('id' => 'CI', 'text' => 'Côte D\'Ivoire'),
            array('id' => 'HR', 'text' => 'Croatie'),
            array('id' => 'CU', 'text' => 'Cuba'),
            array('id' => 'CY', 'text' => 'Chypre'),
            array('id' => 'CZ', 'text' => 'République tchèque'),
            array('id' => 'DK', 'text' => 'Danemark'),
            array('id' => 'DJ', 'text' => 'Djibouti'),
            array('id' => 'DM', 'text' => 'Dominique'),
            array('id' => 'DO', 'text' => 'République dominicaine'),
            array('id' => 'CE', 'text' => 'Equateur'),
            array('id' => 'EG', 'text' => 'Egypte'),
            array('id' => 'SV', 'text' => 'El Salvador'),
            array('id' => 'GQ', 'text' => 'Guinée équatoriale'),
            array('id' => 'ER', 'text' => 'Erythrée'),
            array('id' => 'EE', 'text' => 'Estonie'),
            array('id' => 'ET', 'text' => 'Éthiopie'),
            array('id' => 'FK', 'text' => 'Falkland Islands (Malvinas)'),
            array('id' => 'FO', 'text' => 'Îles Féroé'),
            array('id' => 'FJ', 'text' => 'Fidji'),
            array('id' => 'FI', 'text' => 'Finlande'),
            array('id' => 'FR', 'text' => 'France'),
            array('id' => 'GF', 'text' => 'Guyane française'),
            array('id' => 'PF', 'text' => 'Polynésie française'),
            array('id' => 'TF', 'text' => 'Terres Australes Françaises'),
            array('id' => 'GA', 'text' => 'Gabon'),
            array('id' => 'GM', 'text' => 'Gambie'),
            array('id' => 'GE', 'text' => 'Georgia'),
            array('id' => 'DE', 'text' => 'Allemagne'),
            array('id' => 'GH', 'text' => 'Ghana'),
            array('id' => 'GI', 'text' => 'Gibraltar'),
            array('id' => 'GR', 'text' => 'Grèce'),
            array('id' => 'GL', 'text' => 'Groenland'),
            array('id' => 'GD', 'text' => 'Grenade'),
            array('id' => 'GP', 'text' => 'Guadeloupe'),
            array('id' => 'GU', 'text' => 'Guam'),
            array('id' => 'GT', 'text' => 'Guatemala'),
            array('id' => 'GG', 'text' => 'Guernesey'),
            array('id' => 'GN', 'text' => 'Guinée'),
            array('id' => 'GW', 'text' => 'Guinée-Bissau'),
            array('id' => 'GY', 'text' => 'Guyane'),
            array('id' => 'HT', 'text' => 'Haïti'),
            array('id' => 'HM', 'text' => 'Heard Island & McDonald Islands'),
            array('id' => 'VA', 'text' => 'Saint-Siège (État de la Cité du Vatican)'),
            array('id' => 'HN', 'text' => 'Honduras'),
            array('id' => 'HK', 'text' => 'Hong Kong'),
            array('id' => 'HU', 'text' => 'Hongrie'),
            array('id' => 'IS', 'text' => 'Islande'),
            array('id' => 'IN', 'text' => 'Inde'),
            array('id' => 'ID', 'text' => 'Indonésie'),
            array('id' => 'IR', 'text' => 'Iran}, Islamic Republic Of'),
            array('id' => 'IQ', 'text' => 'Irak'),
            array('id' => 'IE', 'text' => 'Irlande'),
            array('id' => 'IM', 'text' => 'Isle Of Man'),
            array('id' => 'IL', 'text' => 'Israël'),
            array('id' => 'IT', 'text' => 'Italie'),
            array('id' => 'JM', 'text' => 'Jamaïque'),
            array('id' => 'JP', 'text' => 'Japon'),
            array('id' => 'JE', 'text' => 'Jersey'),
            array('id' => 'JO', 'text' => 'Jordan'),
            array('id' => 'KZ', 'text' => 'Kazakhstan'),
            array('id' => 'KE', 'text' => 'Kenya'),
            array('id' => 'KI', 'text' => 'Kiribati'),
            array('id' => 'KR', 'text' => 'Corée'),
            array('id' => 'KW', 'text' => 'Koweit'),
            array('id' => 'KG', 'text' => 'Kirghizistan'),
            array('id' => 'LA', 'text' => 'République démocratique populaire lao'),
            array('id' => 'LV', 'text' => 'Lettonie'),
            array('id' => 'LB', 'text' => 'Liban'),
            array('id' => 'LS', 'text' => 'Lesotho'),
            array('id' => 'LR', 'text' => 'Liberia'),
            array('id' => 'LY', 'text' => 'Libyan Arab Jamahiriya'),
            array('id' => 'LI', 'text' => 'Liechtenstein'),
            array('id' => 'LT', 'text' => 'Lituanie'),
            array('id' => 'LU', 'text' => 'Luxembourg'),
            array('id' => 'MO', 'text' => 'Macao'),
            array('id' => 'MK', 'text' => 'Macedonia'),
            array('id' => 'MG', 'text' => 'Madagascar'),
            array('id' => 'MW', 'text' => 'Malawi'),
            array('id' => 'MY', 'text' => 'Malaysia'),
            array('id' => 'MV', 'text' => 'Maldives'),
            array('id' => 'ML', 'text' => 'Mali'),
            array('id' => 'MT', 'text' => 'Malta'),
            array('id' => 'MH', 'text' => 'Marshall Islands'),
            array('id' => 'MQ', 'text' => 'Martinique'),
            array('id' => 'MR', 'text' => 'Mauritanie'),
            array('id' => 'MU', 'text' => 'Maurice'),
            array('id' => 'YT', 'text' => 'Mayotte'),
            array('id' => 'MX', 'text' => 'Mexique'),
            array('id' => 'FM', 'text' => 'Micronesia}, Federated States Of'),
            array('id' => 'MD', 'text' => 'Moldova'),
            array('id' => 'MC', 'text' => 'Monaco'),
            array('id' => 'MN', 'text' => 'Mongolie'),
            array('id' => 'ME', 'text' => 'Montenegro'),
            array('id' => 'MS', 'text' => 'Montserrat'),
            array('id' => 'MA', 'text' => 'Maroc'),
            array('id' => 'MZ', 'text' => 'Mozambique'),
            array('id' => 'MM', 'text' => 'Myanmar'),
            array('id' => 'NA', 'text' => 'Namibie'),
            array('id' => 'NR', 'text' => 'Nauru'),
            array('id' => 'NP', 'text' => 'Népal'),
            array('id' => 'NL', 'text' => 'Pays-Bas'),
            array('id' => 'AN', 'text' => 'Netherlands Antilles'),
            array('id' => 'NC', 'text' => 'Nouvelle-Calédonie'),
            array('id' => 'NZ', 'text' => 'New Zealand'),
            array('id' => 'NI', 'text' => 'Nicaragua'),
            array('id' => 'NE', 'text' => 'Niger'),
            array('id' => 'NG', 'text' => 'Nigeria'),
            array('id' => 'NU', 'text' => 'Niue'),
            array('id' => 'NF', 'text' => 'Norfolk Island'),
            array('id' => 'MP', 'text' => 'Îles Mariannes du Nord'),
            array('id' => 'NO', 'text' => 'Norvège'),
            array('id' => 'OM', 'text' => 'Oman'),
            array('id' => 'PK', 'text' => 'Pakistan'),
            array('id' => 'PW', 'text' => 'Palau'),
            array('id' => 'PS', 'text' => 'Territoire palestinien}, occupé'),
            array('id' => 'PA', 'text' => 'Panama'),
            array('id' => 'PG', 'text' => 'Papouasie-Nouvelle-Guinée'),
            array('id' => 'PY', 'text' => 'Paraguay'),
            array('id' => 'PE', 'text' => 'Pérou'),
            array('id' => 'PH', 'text' => 'Philippines'),
            array('id' => 'PN', 'text' => 'Pitcairn'),
            array('id' => 'PL', 'text' => 'Pologne'),
            array('id' => 'PT', 'text' => 'Portugal'),
            array('id' => 'PR', 'text' => 'Porto Rico'),
            array('id' => 'QA', 'text' => 'Qatar'),
            array('id' => 'RE', 'text' => 'Reunion'),
            array('id' => 'RO', 'text' => 'Roumanie'),
            array('id' => 'RU', 'text' => 'Fédération de Russie'),
            array('id' => 'RW', 'text' => 'Rwanda'),
            array('id' => 'BL', 'text' => 'Saint Barthelemy'),
            array('id' => 'SH', 'text' => 'Sainte-Hélène'),
            array('id' => 'KN', 'text' => 'Saint Kitts And Nevis'),
            array('id' => 'LC', 'text' => 'Sainte-Lucie'),
            array('id' => 'MF', 'text' => 'Saint Martin'),
            array('id' => 'PM', 'text' => 'Saint Pierre et Miquelon'),
            array('id' => 'VC', 'text' => 'Saint-Vincent-et-les Grenadines'),
            array('id' => 'WS', 'text' => 'Samoa'),
            array('id' => 'SM', 'text' => 'Saint-Marin'),
            array('id' => 'ST', 'text' => 'Sao Tomé et Principe'),
            array('id' => 'SA', 'text' => 'Arabie saoudite'),
            array('id' => 'SN', 'text' => 'Sénégal'),
            array('id' => 'RS', 'text' => 'Serbie'),
            array('id' => 'SC', 'text' => 'Seychelles'),
            array('id' => 'SL', 'text' => 'Sierra Leone'),
            array('id' => 'SG', 'text' => 'Singapour'),
            array('id' => 'SK', 'text' => 'Slovakia'),
            array('id' => 'SI', 'text' => 'Slovénie'),
            array('id' => 'SB', 'text' => 'Solomon Islands'),
            array('id' => 'SO', 'text' => 'Somalie'),
            array('id' => 'ZA', 'text' => 'Afrique du Sud'),
            array('id' => 'GS', 'text' => 'South Georgia And Sandwich Isl'),
            array('id' => 'ES', 'text' => 'Espagne'),
            array('id' => 'LK', 'text' => 'Sri Lanka'),
            array('id' => 'SD', 'text' => 'Soudan'),
            array('id' => 'SR', 'text' => 'Suriname'),
            array('id' => 'SJ', 'text' => 'Svalbard et Jan Mayen'),
            array('id' => 'SZ', 'text' => 'Swaziland'),
            array('id' => 'SE', 'text' => 'Suède'),
            array('id' => 'CH', 'text' => 'Suisse'),
            array('id' => 'SY', 'text' => 'République arabe syrienne'),
            array('id' => 'TW', 'text' => 'Taïwan'),
            array('id' => 'TJ', 'text' => 'Tadjikistan'),
            array('id' => 'TZ', 'text' => 'Tanzanie'),
            array('id' => 'TH', 'text' => 'Thaïlande'),
            array('id' => 'TL', 'text' => 'Timor-Leste'),
            array('id' => 'TG', 'text' => 'Togo'),
            array('id' => 'TK', 'text' => 'Tokelau'),
            array('id' => 'TO', 'text' => 'Tonga'),
            array('id' => 'TT', 'text' => 'Trinité-et-Tobago'),
            array('id' => 'TN', 'text' => 'Tunisie'),
            array('id' => 'TR', 'text' => 'Turquie'),
            array('id' => 'TM', 'text' => 'Turkménistan'),
            array('id' => 'TC', 'text' => 'Turks And Caicos Islands'),
            array('id' => 'TV', 'text' => 'Tuvalu'),
            array('id' => 'UG', 'text' => 'Ouganda'),
            array('id' => 'UA', 'text' => 'Ukraine'),
            array('id' => 'AE', 'text' => 'Emirats Arabes Unis'),
            array('id' => 'GB', 'text' => 'Royaume-Uni'),
            array('id' => 'US', 'text' => 'United States'),
            array('id' => 'UM', 'text' => 'United States Outlying Islands'),
            array('id' => 'UY', 'text' => 'Uruguay'),
            array('id' => 'UZ', 'text' => 'Ouzbékistan'),
            array('id' => 'VU', 'text' => 'Vanuatu'),
            array('id' => 'VE', 'text' => 'Venezuela'),
            array('id' => 'VN', 'text' => 'Viet Nam'),
            array('id' => 'VG', 'text' => 'Virgin Islands}, British'),
            array('id' => 'VI', 'text' => 'Virgin Islands}, États-Unis'),
            array('id' => 'WF', 'text' => 'Wallis And Futuna'),
            array('id' => 'EH', 'text' => 'Sahara occidental'),
            array('id' => 'YE', 'text' => 'Yemen'),
            array('id' => 'ZM', 'text' => 'Zambie'),
            array('id' => 'ZW', 'text' => 'Zimbabwe')
        ];
    }

    public function getFunctions()
    {
        return [
            new TwigFunction('full_date', [$this, 'fullDate']),
            new TwigFunction('menu_exist', [$this, 'menuExist']),
            new TwigFunction('country_name', [$this, 'getCountryName']),
            new TwigFunction('statut_color', [$this, 'getStatutColor']),
        ];
    }

    public function fullDate($date,  $full)
    {
        $date = new DateTime($date);
        if ($date) {
            return $date->format(!$full ? 'Y' : 'd/m/Y');
        }
        return '';
        //return $date ? date_format($date, !$full ? 'Y' : 'd/m/Y') : ''; // NOT OK
    }

    public function menuExist($codeMenu)
    {
        return $this->apiService->getUserAccess($codeMenu);
        // $user = $this->session->get('user');
        // return Tool::in_array_field($codeMenu, "menu", $user['group']['access']);
    }

    public function getCountryName($code)
    {
        return Tool::in_array_field($code, "id", $this->isoCountries);
    }

    public function getStatutColor($statut)
    {
        return $this->statutColors[$statut];
    }
}