# YouGems
- Setup of public website
- This repository is hosted at:  
https://spacebubble.org/
The original repository is located at:
https://github.com/RoysSpaceXL/YouGems
https://roysspacexl.github.io/YouGems/   
is out of order, to view the website, you can use the link above.

# 7 Configuring a subdomain
To set up a www or custom subdomain, such as www.example.com or blog.example.com, you must add your domain in the repository settings. 
- After that, configure a CNAME record with your DNS provider.

On GitHub, navigate to your site's repository.

Under your repository name, click  Settings. If you cannot see the "Settings" tab, select the  dropdown menu, then click Settings.  
//
https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-a-subdomain
//
Navigate to your DNS provider and create a CNAME record that points your subdomain to the default domain for your site. For example, if you want to use the subdomain www.example.com for your user site, create a CNAME record that points www.example.com to <user>.github.io. If you want to use the subdomain another.example.com for your organization site, create a CNAME record that points another.example.com to <organization>.github.io.  
The CNAME record should always point to <user>.github.io or <organization>.github.io, excluding the repository name. 
For more information about how to create the correct record, see your DNS provider's documentation. 
For more information about the default domain for your site, see What is GitHub Pages?

# 8 Sources

Tensor Art Website; https://tensor.art/models  
Genspark;           https://www.genspark.ai/  
mermaid;            https://mermaid.js.org/  
Markdown CDN Tool;  https://cdn.jsdelivr.net/npm/marked/
