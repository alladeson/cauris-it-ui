<?php

namespace App\Service;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Utils\Tool;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;
use Symfony\Component\Mime\Part\DataPart;
use Symfony\Component\Mime\Part\Multipart\FormDataPart;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Path;

class ApiDataService extends AbstractController
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
            'verify_peer'=>false,
            'verify_host'=>false,
        ];
        // get authenticated user
        $response = $client->request(Request::METHOD_GET, $baseUrl . ApiConstant::GET_AUTH_USER_URL, $options);
        $content = $response->getContent(false);
        $status = $response->getStatusCode(false);
        if ($status == 200) {
            $user = json_decode($content);
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

    public static function getSystemParams()
    {
        $session = new Session();
        if (!$session->getId()) $session->start();

        $token = $session->get('token');
        $client = HttpClient::create();
        $baseUrl = $_ENV["API_BASE_URL"];
        $options = [
            'headers' => [
                'Authorization' => "Bearer {$token}",
                'Content-Type' => "application/json"
            ],
            'verify_peer'=>false,
            'verify_host'=>false,
        ];
        // get system params
        $response =  $client->request(Request::METHOD_GET, $baseUrl . ApiConstant::URL_GET_SYSTEM_PARAMS,  $options);
        
        $content = $response->getContent(false);
        $status = $response->getStatusCode(false);
        $params = json_decode($content);
        if ($status == Response::HTTP_OK) {
            $session->set("params", $params);
        } else {
            $session->clear();
        }

        return $status == Response::HTTP_OK ? $params : null;
    }

    public static function getAuthUserAccess()
    {
        $session = new Session();
        if (!$session->getId()) $session->start();

        $token = $session->get('token');
        $client = HttpClient::create();
        $baseUrl = $_ENV["API_BASE_URL"];
        $options = [
            'headers' => [
                'Authorization' => "Bearer {$token}",
                'Content-Type' => "application/json"
            ],
            'verify_peer'=>false,
            'verify_host'=>false,
        ];
        // get accesses for connected user
        $response =  $client->request(Request::METHOD_GET, $baseUrl . ApiConstant::URL_LIST_ACCESS_BY_CONNECTED_USER,  $options);
        
        $content = $response->getContent(false);
        $status = $response->getStatusCode(false);
        $access = json_decode($content);
        if ($status == Response::HTTP_OK) {
            $session->set("access", $access);
        } else {
            $session->clear();
        }
        return $status == Response::HTTP_OK ? $access : null;
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
                'verify_peer'=>false,
                'verify_host'=>false,
            ];
        } else {
            $options = [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiBearerToken,
                ],
                'verify_peer'=>false,
                'verify_host'=>false,
            ];
        }
        return $this->requestUrl($methode, $this->baseUrl . $route, $options);
    }

    /**
     * Envoie une requête HTTP à l'API
     *
     * @param String $methode Méthode HTTP à exécuter
     * @param String $route Route de l'API à exécuter
     * @param object $data Donnée du body de la requète
     * @return ResponseInterface Réponse de la requête
     */
    public function requestGetFile($methode, $route, $data = null): ResponseInterface
    {
        $options = [];
        if (isset($data)) {
            $options = [
                'body' => is_string($data) ? $data : json_encode($data),
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiBearerToken,
                    'Content-Type' => 'application/json',
                ],
                'verify_peer'=>false,
                'verify_host'=>false,
            ];
        } else {
            $options = [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiBearerToken,
                ],
                'verify_peer'=>false,
                'verify_host'=>false,
            ];
        }
        $response = $this->httpClient->request($methode, $route, $options);
        return $response;
    }
    /**
     * Envoie une requête HTTP à l'API
     *
     * @param String $methode Méthode HTTP à exécuter
     * @param String $route Route de l'API à exécuter
     * @param UploadedFile $file Le fichier à envoyer
     * @return ResponseInterface Réponse de la requête
     */
    public function requestFile($methode, $route, $file, $fileName): ResponseInterface
    {
        // Récupération de la destination temporaire du fichier
        $destination = $this->getParameter('kernel.project_dir').'/public/assets/uploads';
        // Enregistrement temporaire du fichier
        $fileName = $fileName.'.'.pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION);
        $file->move($destination, $fileName);
        // Formation des données à envoyer au serveur distant
        $formFields = [
            // Récupération du fichier
            'file' => DataPart::fromPath($destination. "/" . $fileName),
        ]; 
        $formData = new FormDataPart($formFields);
        // Formatage du header de la requête
        $headers = $formData->getPreparedHeaders()->toArray();
        $headers[] = 'Authorization: Bearer ' . $this->apiBearerToken;
        $headers[] = 'Authorization: Bearer ' . $this->apiBearerToken;
        // $headers[] = 'Content-Type: multipart/form-data';
        // Préparation des options de la requête
        $options = [
            'body' => $formData->bodyToIterable(),
            'headers' => $headers,
            'verify_peer'=>false,
            'verify_host'=>false,
        ];
        // Suppression du fichier temporairement enregistré
        // $filesystem = new Filesystem();
        // $filesystem->remove([$destination. "/" . $file->getClientOriginalName()]);
        // Exécution de la requête vers l'api
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
     * Exécute une requête
     */
    public function getFileApi(Request $request): Response
    {
        $method = $request->request->get('method');
        $route = $request->request->get('url');
        $fileName = $request->request->get('fileName');
        $data = $request->request->get('data');
        //
        $response = $this->requestGetFile($method, $route, $data);
        //
        $respContent = $fileName;
        //
        if($response->getStatusCode(false) == Response::HTTP_OK){            
            // Récupération de la destination temporaire du fichier
            $destination = $this->getParameter('kernel.project_dir').'/public/assets/downloads/';
            // Création du fichier
            $filesystem = new Filesystem();
            $filesystem->touch($destination.$fileName);
            // Ouverture du fichier pour l'écriture
            $fileHandler = fopen($destination.$fileName, 'w');
            // Incorporation dans le fichier créé le contenu du fichier uploadé
            foreach ($this->httpClient->stream($response) as $chunk) {
                fwrite($fileHandler, $chunk->getContent());
            }

            //fermeture du fichier créé
            fclose($fileHandler);
        }
        // Envoie du nom du fichier à la vue
        return new Response($respContent, $response->getStatusCode(false));
    }

    /**
     * Envoie une requête pour l'enregistrement d'un fichier
     *
     * @param Request $request
     * @return Response
     */
    public function executeFile(Request $request): Response
    {
        $method = $request->request->get('method');
        $route = $request->request->get('url');
        $fileName = $request->request->get('fileName');
        $file = $request->files->get('file');
        $response = $this->requestFile($method, $route, $file, $fileName);
        return new Response($response->getContent(false), $response->getStatusCode(false));
    }
    /**
     * Envoie une requête pour la mise à jour des paramètres de mise en forme de la vue
     *
     * @param Request $request
     * @return Response
     */

    public function executeLayoutSettings(Request $request): Response
    {
        $session = new Session();
        if (!$session->getId()) $session->start();
        // Récupération du layout de la requête
        $layout = $request->request->get('layout');
        // Transformation du layout en objet, utile pour verifier la présence d'un probable id en vue de la modification
        $layout = is_string($layout) ? json_decode($layout) : $layout;
        // Tentative de récupération de layout depuis la session
        $layoutSession = $session->get('user')->{ 'layout'};
        // Si un layout existe dans la session et que le layout à enregistrer est sans id (ça arrive si l'utilisateur modifie les paramètres du layout sans recharger la page)
        // On met l'id du layout à envoyer à l'api à jour
        if($layoutSession && !$layout->{ 'id'})
            $layout->{ 'id'} = $layoutSession->{ 'id'};
        // Exécution de la requête vers l'api
        $response = $this->request(Request::METHOD_POST, ApiConstant::URL_POST_LAYOUT, $layout);
        // Si tout se passe, l'api renvoie l'utilisateur contenant son layout déjà en base
        if ($response->getStatusCode(false) == Response::HTTP_OK){
            // Mise à jour de l'utilisateur en session
            $session->set("user", json_decode($response->getContent(false)));
        }
        // Renvoie de la réponse à la vue
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
        $access = $this->session->get('access');
        return Tool::in_array_field($menu, "menu", $access);
    }

    public function canUserAccessReadable($menu)
    {
        $access = $this->getUserAccess($menu);
        return $access and $access->{'readable'};
    }
    public function canUserAccessWritable($menu)
    {
        $access = $this->getUserAccess($menu);
        return $access and $access->{'writable'};
    }
    public function canUserAccessDeletable($menu)
    {
        $access = $this->getUserAccess($menu);
        return $access and $access->{'deletable'};
    }
}