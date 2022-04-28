<?php

namespace App\Controller;

use App\Service\ApiDataService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpClient\Exception\TransportException;


use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/__global')]
class GlobalController extends AbstractController
{

    private $apiService;
    public function __construct(ApiDataService $apiService)
    {
        $this->apiService = $apiService;
    }

    #[Route('/__request/api', name: 'global_request_api', methods: ['POST'])]
    public function requestApi(Request $request): Response
    {
        return $this->apiService->execute($request);
    }
}