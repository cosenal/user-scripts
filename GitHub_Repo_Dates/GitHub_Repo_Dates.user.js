// ==UserScript==
// @name        GitHub Repo Dates
// @license     GNU GPLv3
// @namespace   https://github.com/cosenal/Userscripts
// @description Show the date on which a GitHub repo was created
// @include     https://github.com/*
// @version     0.0.1
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// ==/UserScript==

// ==OpenUserJS==
// @author cosenal
// ==/OpenUserJS==

(function() {

    var extraInfo = document.createElement("div");
    extraInfo.style =
        'padding-top: 10px;' +
        'font-style: italic;';

    function fetchData(repo_full_name) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.github.com/repos/' + repo_full_name,
            onload: fillData
        });
    }

    function fillData(response) {
        parsedRes = JSON.parse(response.responseText);
        var date = new Date(parsedRes.created_at);
        var content = "Created on " + date.toDateString()
        var extraInfoContent = document.createTextNode(content);
        extraInfo.appendChild(extraInfoContent);
    }

    var repoMetaDiv = document.getElementsByClassName('repository-meta-content'); 
    if (repoMetaDiv.length > 0) {
        var parser = document.createElement('a');
        parser.href = document.querySelector("link[rel=canonical]").getAttribute("href");
        var str = parser.pathname
        fetchData(str.slice(1, str.length));
        repoMetaDiv[0].appendChild(extraInfo);
    }

})();
