// ==UserScript==
// @name         GitHub Repo Dates
// @description  Display creation date of GitHub repositories
// @copyright    2024, cosenal (https://cosenal.github.io/)
// @license      MIT
// @namespace    https://github.com/cosenal/user-scripts
// @version      0.1.0
// @match        https://github.com/*/*
// @grant        GM_xmlhttpRequest
// @connect      api.github.com
// ==/UserScript==

// ==OpenUserJS==
// @author       cosenal
// ==/OpenUserJS==

(function() {
    // Ensure we are on the main repository page
    const pathParts = document.location.pathname.split('/');
    if (pathParts.length > 3 && pathParts[3] !== "") {
        return;
    }

    function fetchData(repo_full_name) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.github.com/repos/' + repo_full_name,
            onload: fillData
        });
    }

    function fillData(response) {
        var parsedRes = JSON.parse(response.responseText);
        var date = new Date(parsedRes.created_at);
        var options = { year: 'numeric', month: 'long' };
        var formattedDate = date.toLocaleDateString('en', options);

        var content = "Since " + formattedDate;
        var extraInfoContent = document.createTextNode(content);

        var extraInfo = document.createElement("div");
        extraInfo.appendChild(extraInfoContent);
        var headers = document.querySelectorAll('.BorderGrid-cell h3');
        headers.forEach(function(header) {
            if (header.textContent.trim() === "Resources") {
                header.parentNode.insertBefore(extraInfo, header.nextSibling);
            }
        });
    }

    var canonicalLink = document.querySelector('link[rel=canonical]').getAttribute("href");
    var repoPath = new URL(canonicalLink).pathname.slice(1);

    fetchData(repoPath);
})();
