<?php
/**
 * GitHub Webhook Auto-Deploy Script for RIAPress Theme
 *
 * This script receives webhook notifications from GitHub and automatically
 * pulls the latest changes to deploy the theme.
 *
 * @version 1.0
 * @author Claude Code
 */

// Configuration
define('SECRET_TOKEN', 'riapress_deploy_2024_secure_token'); // You'll set this in GitHub too
define('THEME_PATH', __DIR__); // Current directory (where this script lives)
define('LOG_FILE', __DIR__ . '/deploy.log');
define('BRANCH', 'refs/heads/main'); // Only deploy from main branch

// Log function
function log_message($message) {
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "[{$timestamp}] {$message}\n";
    file_put_contents(LOG_FILE, $log_entry, FILE_APPEND);
}

// Verify GitHub signature
function verify_signature($payload, $signature) {
    if (empty($signature)) {
        return false;
    }

    $hash = 'sha256=' . hash_hmac('sha256', $payload, SECRET_TOKEN);
    return hash_equals($hash, $signature);
}

// Main webhook handler
function handle_webhook() {
    // Get the payload
    $payload = file_get_contents('php://input');
    $signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';

    // Verify signature
    if (!verify_signature($payload, $signature)) {
        log_message('ERROR: Invalid signature - unauthorized webhook request');
        http_response_code(403);
        die('Forbidden');
    }

    // Decode payload
    $data = json_decode($payload, true);

    // Check if it's a push to main branch
    if (!isset($data['ref']) || $data['ref'] !== BRANCH) {
        log_message('INFO: Ignoring push to branch: ' . ($data['ref'] ?? 'unknown'));
        http_response_code(200);
        echo json_encode(['status' => 'ignored', 'message' => 'Not main branch']);
        exit;
    }

    // Log the deployment attempt
    $pusher = $data['pusher']['name'] ?? 'unknown';
    $commit = substr($data['after'] ?? 'unknown', 0, 7);
    $commit_message = $data['head_commit']['message'] ?? 'No message';

    log_message("=== DEPLOYMENT STARTED ===");
    log_message("Pushed by: {$pusher}");
    log_message("Commit: {$commit}");
    log_message("Message: {$commit_message}");

    // Change to theme directory
    chdir(THEME_PATH);

    // Execute git pull
    $output = [];
    $return_var = 0;

    // Git pull command
    exec('git pull origin main 2>&1', $output, $return_var);

    // Log the output
    foreach ($output as $line) {
        log_message("GIT: {$line}");
    }

    if ($return_var === 0) {
        log_message("=== DEPLOYMENT SUCCESSFUL ===");
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Theme deployed successfully',
            'commit' => $commit
        ]);
    } else {
        log_message("=== DEPLOYMENT FAILED ===");
        log_message("ERROR: Git pull failed with return code {$return_var}");
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Git pull failed',
            'output' => $output
        ]);
    }
}

// Execute
handle_webhook();
