<?php

namespace App\Controller;

use App\Service\ApiDataService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/__global')]
class GlobalController extends AbstractController
{

    private $apiService;
    public function __construct(ApiDataService $apiService)
    {
        $this->apiService = $apiService;
    }

    #[Route('/__request/api', name:'global_request_api', methods:['POST'])]
    function requestApi(Request $request): Response
        {
        return $this->apiService->execute($request);
    }

    #[Route('/__request/file/api', name:'global_request_file_api', methods:['POST'])]
    function requestFileApi(Request $request): Response
        {
        return $this->apiService->executeFile($request);
    }

    #[Route('/__request/api/layout-settings', name:'global_request_layout_settings', methods:['POST'])]
    function requestLayoutSettings(Request $request): Response
        {
        return $this->apiService->executeLayoutSettings($request);
    }

    #[Route('/__get/file/api', name:'global_get_file_api', methods:['POST'])]
    function getFileApi(Request $request): Response
    {
        return $this->apiService->getFileApi($request);
    }
}
