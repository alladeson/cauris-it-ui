<?php

namespace App\Service;

use App\Utils\Tool;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

class ApiDataService
{
    private $httpClient;
    private $baseUrl;
    private $apiBearerToken;
    private $session;
    private $logger;
    // private UrlGeneratorInterface $urlGenerator;

    public static function requestAuthUser()
    {
        $session = new Session();
        if (!$session->getId()) {
            $session->start();
        }

        $token = $session->get('token');
        $client = HttpClient::create();
        $baseUrl = $_ENV["API_BASE_URL"];
        $options = [
            'headers' => [
                'Authorization' => "Bearer {$token}",
                'Content-Type' => "application/json",
            ],
        ];
        // get authenticated user
        $response = $client->request(Request::METHOD_GET, $baseUrl . ApiConstant::GET_AUTH_USER_URL, $options);
        $content = $response->getContent(false);
        $status = $response->getStatusCode(false);
        if ($status == 200) {
            $user = json_decode($content, true);
            $session->set("user", $user);
        } else {
            $session->clear();
        }
        $user_response = $response;

        // // get system info and store this info and logo in the session
        // $response = $client->request(Request::METHOD_GET, $baseUrl . ApiConstant::GET_PUBLIC_SYSTEM_INFO_URL);
        // $content = $response->getContent(false);
        // $status = $response->getStatusCode(false);
        // if ($status == 200) {
        //     $sysinfo = json_decode($content, true);
        //     $session->set("sysinfo", $sysinfo);
        //     $session->set("applogo", ApiConstant::GET_LOGO_FILE_URL);
        // } else {
        //     $session->clear();
        // }

        return $user_response;
    }

    public static function getAuthUser()
    {
        $response = self::requestAuthUser();
        $content = $response->getContent(false);
        $status = $response->getStatusCode(false);

        return $status == Response::HTTP_OK ? json_decode($content) : null;
    }

    //

    /**
     * Constructeur pour injecter le client http
     *
     * @param HttpClientInterface $httpClient
     */
    public function __construct(HttpClientInterface $httpClient, LoggerInterface $logger/*, UrlGeneratorInterface $urlGenerator*/)
    {
        //$this->urlGenerator = $urlGenerator;
        $this->httpClient = $httpClient;
        $this->baseUrl = $_ENV["API_BASE_URL"];
        $this->session = new Session();
        if (!$this->session->getId()) {
            $this->session->start();
        }

        $this->apiBearerToken = $this->session->get("token");
        //Logger
        $this->logger = $logger;
    }

    /**
     * Retourne l'url de base de l'api
     *
     * @return String
     */
    public function getBaseUrl(): String
    {
        return $this->baseUrl;
    }

    /**
     *
     */
    public function requestUrl($method, $url, array $options = []): ResponseInterface
    {
        $response = $this->httpClient->request($method, $url, $options);
        //$this->logError($response);
        return $response;
    }

    /**
     * Envoie une requête HTTP à l'API
     *
     * @param String $methode Méthode HTTP à exécuter
     * @param String $route Route de l'API à exécuter
     * @param object $data Donnée du body de la requète
     * @return ResponseInterface Réponse de la requête
     */
    public function request($methode, $route, $data = null): ResponseInterface
    {
        $options = [];
        if (isset($data)) {
            $options = [
                'body' => is_string($data) ? $data : json_encode($data),
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiBearerToken,
                    'Content-Type' => 'application/json',
                ],
            ];
        } else {
            $options = [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiBearerToken,
                ],
            ];
        }
        return $this->requestUrl($methode, $this->baseUrl . $route, $options);
    }

    /**
     * Envoie une requête HTTP à l'API et reçoie les données sous forme de tableau.
     *
     * @param String $methode
     * @param String $route
     * @param object $data
     * @return array
     */
    public function requestToArray($methode, $route, $data = null): array
    {
        $response = $this->request($methode, $route, $data);
        return $response->toArray(false);
    }

    /**
     * Envoie une requête HTTP GET à l'API et reçoie les données sous forme de tableau.
     *
     * @param String $route
     * @return object
     */
    public function getToArray($route)
    {
        return $this->requestToArray(Request::METHOD_GET, $route);
    }

    /**
     * Envoie une requête HTTP POST à l'API et reçoie les données sous forme de tableau.
     *
     * @param String $route
     * @param object $data
     * @return array
     */
    public function postToArray($route, $data = null)
    {
        return $this->requestToArray(Request::METHOD_POST, $route, $data);
    }

    /**
     * Envoie une requête HTTP PUT à l'API et reçoie les données sous forme de tableau.
     *
     * @param String $route
     * @param object $data
     * @return array
     */
    public function putToArray($route, $data = null)
    {
        return $this->requestToArray(Request::METHOD_PUT, $route, $data);
    }

    /**
     * Envoie une requête HTTP DELETE à l'API et reçoie les données sous forme de tableau.
     *
     * @param String $route
     * @param object $data
     * @return array
     */
    public function deleteToArray($route, $data = null)
    {
        return $this->requestToArray(Request::METHOD_DELETE, $route, $data);
    }

    /**
     * Envoie une requête HTTP à l'API et reçoie les données sous forme d'objet.
     *
     * @param String $methode
     * @param String $route
     * @param object $data
     */
    public function requestToJson($methode, $route, $data = null)
    {
        $response = $this->request($methode, $route, $data);
        return json_decode($response->getContent(false));
    }

    /**
     * Envoie une requête HTTP GET à l'API et reçoie les données sous forme d'objet.
     *
     * @param String $route
     * @return object
     */
    public function get($route)
    {
        return $this->requestToJson(Request::METHOD_GET, $route);
    }

    /**
     * Envoie une requête HTTP POST à l'API et reçoie les données sous forme d'objet.
     *
     * @param String $route
     * @param object $data
     * @return object
     */
    public function post($route, $data = null)
    {
        return $this->requestToJson(Request::METHOD_POST, $route, $data);
    }

    /**
     * Envoie une requête HTTP PUT à l'API et reçoie les données sous forme d'objet.
     *
     * @param String $route
     * @param object $data
     * @return object
     */
    public function put($route, $data = null)
    {
        return $this->requestToJson(Request::METHOD_PUT, $route, $data);
    }

    /**
     * Envoie une requête HTTP DELETE à l'API et reçoie les données sous forme d'objet.
     *
     * @param String $route
     * @param object $data
     * @return object
     */
    public function delete($route, $data = null)
    {
        return $this->requestToJson(Request::METHOD_DELETE, $route, $data);
    }

    /**
     * Exécute une requête
     */
    public function execute(Request $request): Response
    {
        $method = $request->request->get('method');
        $route = $request->request->get('url');
        $data = $request->request->get('data');

        $response = $this->request($method, $route, $data);
        return new Response($response->getContent(false), $response->getStatusCode(false));
    }

    /**
     *
     * @param
     */
    public function logError($response)
    {
        if ($response->getStatusCode(false) != 200) {
            $this->setLogger($response->getContent(false), null);
        }

    }

    /**
     * Mettre à jour le fichier de log
     *
     * @param String $message
     * @param Array $context, default Null
     * @return void
     */
    public function setLogger($message, $context)
    {
        $this->logger->error($message, $context ? $context : []);
    }

    /**
     * Méthode de récupération des données depuis l'API
     *
     * @param String $methode La méthode http à utilisé
     * @param String $route L'url à appeler
     * @return Array Tableau de la valeur de retour et du code du statut de la reponse
     */
    public function getData($methode, $route): ResponseInterface
    {
        // $options = [
        //     'headers' => [
        //         'Authorization' => 'Bearer ' . $this->apiBearerToken,
        //     ]
        // ];
        $response = $this->request($methode, $route);
        return $response;
    }

    /**
     * Envoie de données l'API pour la création et la mise à jour des entités
     *
     * @param String $methode La méthode http à utilisé
     * @param String $route L'url à appeler
     * @param object $data la donnée du body de la requète
     * @return Array Tableau de la valeur de retour et du code du statut de la reponse
     */
    public function sendData($methode, $route, $data): ResponseInterface
    {
        // $options = [
        //     'body' => is_string($data) ? $data : json_encode($data),
        //     'headers' => [
        //         'Authorization' => 'Bearer ' . $this->apiBearerToken,
        //         'Content-Type' => 'application/json',
        //     ]
        // ];
        $response = $this->request($methode, $route, $data);
        return $response;
    }

    public function getUserAccess($menu)
    {
        $user = $this->session->get('user');
        return Tool::in_array_field($menu, "menu", $user['group']['access']);
    }

    public function canUserAccess($menu)
    {
        $user = $this->session->get('user');
        if ($user['admin']) {
            return true;
        }

        $access = $this->getUserAccess($menu);
        return $access and ($access['readable'] or $access['writable'] or $access['deletable']);
    }

    public function canUserAccessEnregistrement()
    {
        return $this->canUserAccess(ApiConstant::PROCESS_ENREGISTREMENT);
    }

    public function canUserAccessVerificationRavec()
    {
        return $this->canUserAccess(ApiConstant::PROCESS_VERIFICATION_RAVEC);
    }

    public function canUserAccessVisaParquet()
    {
        return $this->canUserAccess(ApiConstant::PROCESS_VISA_PARQUET);
    }

    public function canUserAccessDecisionTribunal()
    {
        return $this->canUserAccess(ApiConstant::PROCESS_VERIFICATION_CONFORMITE);
    }

}