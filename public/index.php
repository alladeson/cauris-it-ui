<?php

use App\Kernel;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Request;

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

return function (array $context) {

    $session = new Session();
    if (!$session->getId()) $session->start();

    // Récupération de l'url de la requête en supprimant les espaces vides
    //$requestUri = trim($_SERVER['REQUEST_URI']);
    $request = Request::createFromGlobals();
    $requestPath = trim($request->getPathInfo());
    $queryPath = trim($request->query->get('uri'));
    $home = [ "/", "/dashboard"];

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

        // Vérifie la validité du token
        $expirytime = $session->get('expiryToken'); //dd($expirytime);
        $expirytime = intval($expirytime / 1000); //dd($expirytime);
        $expirydate = new DateTime("@$expirytime");
        // $expirydate = new DateTime($session->get('expiryToken'));
        $interval = (new DateTime())->diff($expirydate);
        // - Si le token a expiré, alors redirige à la page de connexion
        if ($interval->invert) {
            $session->clear();
            return header("Location: " . (in_array($requestPath, $home) || str_starts_with($requestPath, "/auth") ? "/auth/login" : "/auth/login?uri=" . $requestPath));
        }

        // - Sinon c-a-d le token est valide, alors récupère le compte utilisateur connecté
        // $user = ApiDataService::getAuthUser();
        $user = $session->get('user');
        //dd($user);

        // - Si le compte utilisateur connecté est inexistante (FATAL ERROR)
        if (!$user) {
            $session->clear();
            return header("Location: " . (in_array($requestPath, $home) || str_starts_with($requestPath, "/auth") ? "/auth/login?fatal-error" : "/auth/login?fatal-error&uri=" . $requestPath));
        }

        // // - Sinon c-a-d le compte utilisateur connecté existe et s'il n'est pas activé, alors redirige à la page d'activation (du changement du mot de passe par défaut)
        // if (!$user->active) {
        //     if (str_starts_with($requestPath, "/auth/password")) {
        //         return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
        //     }
        //     return header("Location: " . (in_array($requestPath, $home) || str_starts_with($requestPath, "/auth") ? "/auth/password/activate" : "/auth/password/activate?uri=" . $requestPath));
        // }

        // Sinon c-a-d le compte utilisateur connecté existe et est activé
        // if (str_starts_with($requestPath, "/auth")) {
        //     dd('ici');
        //     return header("Location: " . (empty($queryPath) ? "/" : $queryPath));
        // }
        return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
    }
};