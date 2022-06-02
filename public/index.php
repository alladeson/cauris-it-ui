<?php

use App\Kernel;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Response;

require_once dirname(__DIR__) . '/vendor/autoload_runtime.php';

return function (array $context) {

    $session = new Session();
    if (!$session->getId()) {
        $session->start();
    }

    // Récupération de l'url de la requête en supprimant les espaces vides
    //$requestUri = trim($_SERVER['REQUEST_URI']);
    $request = Request::createFromGlobals();
    $requestPath = trim($request->getPathInfo());
    $queryPath = trim($request->query->get('uri') ? $request->query->get('uri') : "");
    $home = ["/", "/dashboard"];
    $newSystemParamsUrl = "/parametre/system-params/new";
    $URL_GLOBAL_REQUEST = "/__global/__request";

    //dump($requestPath, $queryPath);
    //dd($session->get('token'));

    // Gestion de la rédirection selon les cas :

    // Cas : Aucun compte utilisateur connecté
    if (!$session->get('token')) {

        if (str_starts_with($requestPath, "/auth/login")) {
            return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
        } else {
            return header("Location: " . (in_array($requestPath, $home) || str_starts_with($requestPath, "/auth") ? "/auth/login" : "/auth/login?uri=" . $requestPath));
        }
    }
    // Cas : Compte utilisateur connecté
    else {
        // Récupération de l'utilisateur connecté
        $user = $session->get('user');
        // Vérifie la validité du token
        $expirytime = $session->get('expiryToken'); //dd($expirytime);
        $expirytime = intval($expirytime / 1000); //dd($expirytime);
        $expirydate = new DateTime("@$expirytime");
        // $expirydate = new DateTime($session->get('expiryToken'));
        $interval = (new DateTime())->diff($expirydate);
        // - Si le token a expiré, alors redirige à la page de connexion
        if ($interval->invert || str_starts_with($requestPath, "/auth/logout")) {
            // Récupération du layout de l'utilisateur
            // $layout = $user->{'layout'};
            $layout = is_array($user) ? $user['layout'] : $user->{'layout'};
            // Suppression des données de la session
            $session->clear();
            // Mise à jour du layout dans la session
            $session->set("user", (object)["layout" => $layout]);
            // 
            return header("Location: " . (in_array($requestPath, $home) || str_starts_with($requestPath, "/auth") ? "/auth/login" : "/auth/login?uri=" . $requestPath));
        }

        // - Sinon c-a-d le token est valide
        // - Si le compte utilisateur connecté est inexistante (FATAL ERROR)
        if (!$user) {
            $session->clear();
            return header("Location: " . (in_array($requestPath, $home) || str_starts_with($requestPath, "/auth") ? "/auth/login?fatal-error" : "/auth/login?fatal-error&uri=" . $requestPath));
        }

        // Vérification de la présence du paramètre du system
        $params = $session->get('params');
        if(!$params && str_starts_with($requestPath, $URL_GLOBAL_REQUEST)){
            return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
        }
        if (!$params && !str_starts_with($requestPath, $newSystemParamsUrl)) {
            if ($user->{'sa'}) {
                return header("Location: " . $newSystemParamsUrl);
            }else {
                throw new \Exception("Les informations du paramètre du système ne sont pas définies. Veuillez contacter votre fournisseur du SFE !", Response::HTTP_UNAUTHORIZED); 
            }
        } else if ($params && str_starts_with($requestPath, $newSystemParamsUrl)) {
            return header("Location: " . $home[0]);
        }

        return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
    }
};
