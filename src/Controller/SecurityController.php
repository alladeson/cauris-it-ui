<?php

namespace App\Controller;

use App\Service\ApiConstant;
use App\Service\ApiDataService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpClient\Exception\TransportException;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

#[Route('/auth')]
class SecurityController extends AbstractController
{
    private UrlGeneratorInterface $urlGenerator;
    private $apiService;
    private $session;
    public function __construct(ApiDataService $apiDataService, UrlGeneratorInterface $urlGenerator)
    {
        $this->urlGenerator = $urlGenerator;
        $this->apiService = $apiDataService;
        $this->session = new Session();
        if (!$this->session->getId())
            $this->session->start();
    }

    #[Route('/login', name: 'app_login')]
    public function login(Request $request): Response
    {
        $queryParam = $request->query->get('uri');

        return $this->render('auth/login.html.twig', [
            'page_title' => 'Connexion',
            "query_param" => $queryParam ? $queryParam : "",
        ]);
    }

    /**
     * Afficher la page de changement de mot de passe en vue de l'activation du compte de l'utilisateur
     */
    #[Route('/password/activate', name: 'app_password_activate')]
    public function activationPage(Request $request): Response
    {
        $queryParam = $request->query->get('uri');
        $sysinfo = $this->apiService->get(ApiConstant::GET_PUBLIC_SYSTEM_INFO_URL);

        return $this->render('security/change_password.html.twig', [
            'page_name' => 'Changement mot de passe',
            "query_param" => $queryParam ? $queryParam : "",
        ]);
    }

    
    #[Route('/login/api', name: 'api_login', methods:["POST"])]
    public function getApiToken(Request $request): Response
    {
        try {
            // $response = $this->apiService->sendData("POST", "public/signin/", $this->setData($request, null));
            $response = $this->apiService->request("POST", "public/signin/", $this->setData($request, null));
            if ($response->getStatusCode(false) ==  Response::HTTP_OK) {
                $responseObjet = json_decode($response->getContent(false));
                // set session attributes
                $this->session->set("token", $responseObjet->{'token'});
                $this->session->set("fullToken", "Bearer " . $responseObjet->{'token'});
                $this->session->set("tokenType", $responseObjet->{'tokenType'});
                $this->session->set("expiryToken", $responseObjet->{'expiryToken'});

                // Récupération de l'utilisateur connecté
                $user = ApiDataService::getAuthUser();
                // $this->session->set("user", $user);
                // Récupération du paramètre du system et sauvegarde dans le session
                $params = ApiDataService::getSystemParams();
                // $this->session->set("params", $params);
                // Récupération des accès et sauvegarde dans le session
                $access = ApiDataService::getAuthUserAccess();
                // $this->session->set("access", $access);
            }
            return new Response($response->getContent(false), $response->getStatusCode(false));
        } catch (TransportException $e) {
            return new Response($e->getMessage(), Response::HTTP_BAD_GATEWAY);
        }
    }

    /**
     * Mettre à jour les données de l'utilisateur connecté
     *
     * @return Response
     */
    #[Route('/user/auth-reset', name: 'user_session_reset', methods:["POST"])]
    public function resetAuthUser(Request $request): Response
    {
        $user = null;
        try {
            // Récupération de l'utilisateur connecté
            $user = ApiDataService::getAuthUser();
            $this->session->set("user", $user);
        } catch (TransportException $th) {
            throw $th;
            //dd($th);
        }
        return new Response(json_encode($user), 200);
    }

    #[Route('/logout', name: 'app_logout')]
    public function logout()
    {
        $this->session->clear();
        return new RedirectResponse($this->urlGenerator->generate('app_login'));
    }

    #[Route('/auth/password/activate/api', name: 'auth_activation', methods:['POST'])]
    public function activate(Request $request): Response
    {
        try {
            $obj = (object) [
                'new' => $request->request->get('password'),
                'confirmed' => $request->request->get('confirm-password'),
            ];
            $data = json_encode($obj);
            $response = $this->apiService->request("POST", ApiConstant::GET_AUTH_ACTIVATE_USER_URL, $data);
            return new Response($response->getContent(false), $response->getStatusCode(false));
     
        } catch (TransportException $e) {
            return new Response($e->getMessage(), 502);
        }
    }

    /**
     * Pour formater et encoder en json les données de login
     *
     * @param Request $request Les données de la requête
     * @return String Objet json
     */
    public function setData(Request $request)
    {
        $obj = (object) [
            'login' => $request->request->get('username'),
            'password' => $request->request->get('password'),
        ];

        return json_encode($obj);
    }
}
