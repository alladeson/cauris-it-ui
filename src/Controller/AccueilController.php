<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class AccueilController extends AbstractController
{
    private UrlGeneratorInterface $urlGenerator;

    public function __construct(UrlGeneratorInterface $urlGenerator)
    {
        $this->urlGenerator = $urlGenerator;
                 
    }
    
    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        return new RedirectResponse($this->urlGenerator->generate('dashboard'));
    }

    #[Route('/dashboard', name: 'dashboard')]
    public function dashboard(): Response
    {
        return $this->render('admin/dashboard.html.twig', [
            'page_title' => 'Tableau de bord',
            'breadcrumb' => ['Accueil', 'Tableau de bord'],
            "sidebar_code" => ['TB', '', '']
        ]);
    }
}
