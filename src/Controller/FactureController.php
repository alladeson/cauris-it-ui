<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
#[Route('/facture')]
class FactureController extends AbstractController
{
    #[Route('/facture-vente', name: 'facture_vente')]
    public function index(): Response
    {
        return $this->render('facture/facture-vente.html.twig', [
            'page_title' => 'Facture Ventes',
            'breadcrumb' => ['Facture', 'Facture Ventes'],
            "sidebar_code" => ['FACT', 'FACTV', ''],
            "facture_id" => null,
        ]);
    }
}
