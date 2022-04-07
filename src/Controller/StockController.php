<?php

namespace App\Controller;

use App\Service\ApiConstant;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/stock')]
class StockController extends AbstractController
{
    #[Route('/categorie-articles', name: 'gstk_categorie_article')]
    public function CategorieArticle(): Response
    {
        return $this->render('stock/categorie-article.html.twig', [
            'page_title' => 'Catégorie Articles/Produits',
            'breadcrumb' => ['Gestion de Stock', 'Catégorie Articles/Produits'],
            "sidebar_code" => ['GSTK', 'CAP', ''],
        ]);
    }

    #[Route('/articles', name: 'gstk_article')]
    public function article(): Response
    {
        return $this->render('stock/article.html.twig', [
            'page_title' => 'Articles/Produits',
            'breadcrumb' => ['Gestion de Stock', 'Articles/Produits'],
            "sidebar_code" => ['GSTK', 'A/P', ''],
        ]);
    }
    #[Route('/approvisionnements', name: 'gstk_approvisionnement')]
    public function approvisionnement(): Response
    {
        return $this->render('stock/approvisionnement.html.twig', [
            'page_title' => 'Approvisionnement',
            'breadcrumb' => ['Gestion de Stock', 'Approvisionnement'],
            "sidebar_code" => ['GSTK', 'APPR', ''],
        ]);
    }
}
