/* =====================================================================
   Ask the training: extra words and phrases
   ---------------------------------------------------------------------
   Edit this file on GitHub to teach the Ask box new ways of asking.
   Save (commit) your change, then refresh the training page. A private
   window or Ctrl+F5 will make sure you see the latest version.

   Rules:
   - Keep everything in lower case.
   - Put each entry in "double quotes", with a comma at the end.
   - Lines starting with // are notes and are ignored.
   ===================================================================== */

/* 1. ALTERNATIVE WORDS
   Left: a word or phrase people might type.
   Right: the word or words Connect uses.
   The Ask box searches for BOTH, so nothing is lost.            */
window.ASK_TERMS = {
  "search": "check",
  "searches": "check",
  "screening": "sanctions peps check",
  "screen": "sanctions peps check",
  "watchlist": "sanctions peps",
  "re-screen": "ongoing monitoring",
  "rescreen": "ongoing monitoring",
  "re-check": "ongoing monitoring",
  "kyc": "identity verification check",
  "id check": "identity verification",
  "id&v": "identity verification",
  "proof of address": "address",
  "poa": "address",
  "proof of id": "identity",
  "customer": "individual",
  "applicant": "individual",
  "tenant": "individual",
  "buyer": "individual",
  "seller": "individual",
  "case": "individual",
  "re-send": "resend",
  "chase": "reminder",
  "nudge": "reminder",
  "lock out": "lock process",
  "logo": "branding logo",
  "colours": "branding",
  "workflow": "journey",
  "process": "journey",
  "questionnaire": "form",
  "manual review": "remediate",
  "override": "remediate status",
  "sign off": "approve",
  "audit": "notes audit trail",
  "gdpr": "deletion retention",
  "purge": "delete deletion",
  "staff": "user",
  "team member": "user",
  "access level": "role permissions",
  "sub-account": "child portal",
  "franchise": "child portal reseller",
  "branch portal": "child portal",
  "integration keys": "custom credentials api key",
  "api details": "custom credentials api key",
};

/* 2. EXTRA PHRASES FOR AN EXERCISE
   Add any words, tags or sentences you'd like an exercise to be found
   by, between the quotes. For example:
   "remediate-checks": "change a fail to a pass, mark a refer as resolved",  */
window.ASK_EXTRA = {
  // Individuals
  "individuals-search-filter": "",              // Search and filter the list
  "individuals-table-config": "",               // Configure the table
  "individuals-review-results": "",             // Review an individual's results
  "individuals-record-tour": "",                // Explore an individual's record
  "individuals-approve-reject": "",             // Approve or reject an individual

  // Sending journeys
  "send-journey-existing": "",                  // Send a journey to an existing individual
  "send-journey-new-individual": "",            // Add a new individual and send a journey

  // Reports
  "reports-pdf": "",                            // Generate a PDF report

  // Data checks
  "data-check-standalone": "",                  // Run a stand-alone data check

  // Remediation
  "remediate-checks": "",                       // Remediate checks

  // Form Builder
  "form-builder-personal-details": "",          // Build a Personal Details and Address form

  // Journey Builder
  "journey-builder-create": "",                 // Create a new journey

  // Settings
  "settings-branding": "",                      // Change a portal's name and logo
  "settings-invite-rules": "",                  // Set invite rules
  "settings-ongoing-monitoring": "",            // Set up ongoing monitoring
  "settings-deletion-rules": "",                // Set deletion rules
  "settings-id-check-report": "",               // Choose what the ID check report includes

  // Admin Portal
  "admin-add-user": "",                         // Add a portal user
  "admin-user-groups": "",                      // Create a user group and assign users
  "admin-user-roles": "",                       // Create a user role and apply it
  "admin-child-portals": "",                    // Set up a child portal

  // Back Office
  "backoffice-find-user": "",                   // Find a user in Back Office
  "backoffice-find-end-user": "",               // Find an end-user in Back Office
  "backoffice-portals": "",                     // Create a portal and find an existing one
  "backoffice-portal-details": "",              // Update a portal's details
  "backoffice-portal-settings": "",             // Configure a portal's settings
  "backoffice-portal-applications": "",         // Choose a portal's applications
  "backoffice-portal-journeys": "",             // Choose a portal's journeys
};
