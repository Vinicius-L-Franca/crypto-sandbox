import urllib.request
import re
import os

screens = {
    "analytics_desempenho.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzU0NzU4ZGNmZDMyOTQzNmZhMDYwOGZjYWM3ZmRiYTc5EgsSBxDv7cmU_hgYAZIBIwoKcHJvamVjdF9pZBIVQhM3NTk4MzAyOTI1MjkwNjM2OTY5&filename=&opi=89354086",
    "portfolio_carteira.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzZjZGNiYTY0ZmEzZDQ2MmU4ZTIxYzc3ODNiNmU1ZjIwEgsSBxDv7cmU_hgYAZIBIwoKcHJvamVjdF9pZBIVQhM3NTk4MzAyOTI1MjkwNjM2OTY5&filename=&opi=89354086",
    "transacoes.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2E0ZjZkOTNiYjc0NjRhYzNiNWYwMmUzZDM1YzgwZWFiEgsSBxDv7cmU_hgYAZIBIwoKcHJvamVjdF9pZBIVQhM3NTk4MzAyOTI1MjkwNjM2OTY5&filename=&opi=89354086",
    "negociacao.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzUzOGM3M2EyODFlMzQzNGY5MTFkNmMzZGYwYzU1OWVjEgsSBxDv7cmU_hgYAZIBIwoKcHJvamVjdF9pZBIVQhM3NTk4MzAyOTI1MjkwNjM2OTY5&filename=&opi=89354086",
    "painel_de_controle.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2M3NzkxYmM4NTExYTQ0ZTI5MzUyODNlZTkzZjA1YzFkEgsSBxDv7cmU_hgYAZIBIwoKcHJvamVjdF9pZBIVQhM3NTk4MzAyOTI1MjkwNjM2OTY5&filename=&opi=89354086",
    "conf_seguranca_header.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzEwN2JkNmE5OTdiMzQwNTJiZTVhYmRhN2ViYmNhM2JiEgsSBxDv7cmU_hgYAZIBIwoKcHJvamVjdF9pZBIVQhM3NTk4MzAyOTI1MjkwNjM2OTY5&filename=&opi=89354086",
    "analytics_desempenho_header.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2I1ZjAyMDgxNmY5NTQwNjhhM2ZkMjFlYjZlNmQ0MWU5EgsSBxDv7cmU_hgYAZIBIwoKcHJvamVjdF9pZBIVQhM3NTk4MzAyOTI1MjkwNjM2OTY5&filename=&opi=89354086",
    "conf_seguranca.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2JiZTk3ZmNmNzFjYjQ5YWNiMDdmZGM4MDVjMzMyOGQ4EgsSBxDv7cmU_hgYAZIBIwoKcHJvamVjdF9pZBIVQhM3NTk4MzAyOTI1MjkwNjM2OTY5&filename=&opi=89354086",
    "prd.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2JmNzk4MzgyODA5YTQwN2Y4ZDgyMjE2ODcwYTI2ZDViEgsSBxDv7cmU_hgYAZIBIwoKcHJvamVjdF9pZBIVQhM3NTk4MzAyOTI1MjkwNjM2OTY5&filename=&opi=89354086",
    "conf_sem_icone.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzI2MjI4M2VhZGU0NzQ2Y2ZiYjg4ZDE4M2UxMDk5MzFkEgsSBxDv7cmU_hgYAZIBIwoKcHJvamVjdF9pZBIVQhM3NTk4MzAyOTI1MjkwNjM2OTY5&filename=&opi=89354086",
    "conectar_carteira.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzI0YzYzOWVkYjE1ZDRkMmJhYjc1YzdmYWUyNTk5NGU3EgsSBxDv7cmU_hgYAZIBIwoKcHJvamVjdF9pZBIVQhM3NTk4MzAyOTI1MjkwNjM2OTY5&filename=&opi=89354086",
    "analytics_aba_conf.html": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2ZiYWI5MTEyMDI0ZTRmNDNiNzNkYzRkNmQ4OGQ1MWIzEgsSBxDv7cmU_hgYAZIBIwoKcHJvamVjdF9pZBIVQhM3NTk4MzAyOTI1MjkwNjM2OTY5&filename=&opi=89354086"
}

class_mapping = {
    # Layout & Flexbox
    r'\bflex\b': 'd-flex',
    r'\binline-flex\b': 'd-inline-flex',
    r'\bflex-col\b': 'flex-column',
    r'\bflex-row\b': 'flex-row',
    r'\bitems-center\b': 'align-items-center',
    r'\bitems-start\b': 'align-items-start',
    r'\bitems-end\b': 'align-items-end',
    r'\bjustify-center\b': 'justify-content-center',
    r'\bjustify-between\b': 'justify-content-between',
    r'\bjustify-start\b': 'justify-content-start',
    r'\bjustify-end\b': 'justify-content-end',
    r'\bflex-1\b': 'flex-fill', # Or flex-grow-1
    r'\bflex-wrap\b': 'flex-wrap',
    
    # Sizing
    r'\bw-full\b': 'w-100',
    r'\bh-full\b': 'h-100',
    r'\bh-screen\b': 'vh-100',
    r'\bw-screen\b': 'vw-100',
    
    # Spacing (Approximations)
    r'\bp-4\b': 'p-3',
    r'\bp-6\b': 'p-4',
    r'\bp-8\b': 'p-5',
    r'\bpx-4\b': 'px-3',
    r'\bpx-6\b': 'px-4',
    r'\bpy-2\b': 'py-2',
    r'\bpy-4\b': 'py-3',
    r'\bpy-6\b': 'py-4',
    r'\bm-4\b': 'm-3',
    r'\bmb-4\b': 'mb-3',
    r'\bmb-6\b': 'mb-4',
    r'\bmt-4\b': 'mt-3',
    r'\bmt-8\b': 'mt-5',
    r'\bml-4\b': 'ms-3',
    r'\bgap-2\b': 'gap-2',
    r'\bgap-4\b': 'gap-3',
    r'\bgap-6\b': 'gap-4',
    
    # Typography
    r'\btext-white\b': 'text-light',
    r'\btext-gray-400\b': 'text-secondary',
    r'\btext-gray-300\b': 'text-light-emphasis',
    r'\btext-gray-500\b': 'text-secondary',
    r'\btext-sm\b': 'small',
    r'\btext-xs\b': 'x-small', # will inject custom
    r'\btext-lg\b': 'fs-5',
    r'\btext-xl\b': 'fs-4',
    r'\btext-2xl\b': 'fs-3',
    r'\btext-3xl\b': 'fs-2',
    r'\bfont-bold\b': 'fw-bold',
    r'\bfont-semibold\b': 'fw-semibold',
    r'\bfont-medium\b': 'fw-medium',
    r'\bnormal-case\b': 'text-none',
    r'\buppercase\b': 'text-uppercase',
    r'\btracking-wider\b': 'tracking-wider', # will keep tracking-wider and define it
    
    # Radii
    r'\brounded-lg\b': 'rounded-3',
    r'\brounded-md\b': 'rounded-2',
    r'\brounded-full\b': 'rounded-pill',
    r'\brounded\b': 'rounded',
    
    # Visibility / Display
    r'\bhidden\b': 'd-none',
    r'\bblock\b': 'd-block',
    r'\bmd:block\b': 'd-md-block',
    r'\bmd:hidden\b': 'd-md-none',
    r'\bmd:flex\b': 'd-md-flex',
    r'\blg:flex\b': 'd-lg-flex',
    
    # Colors (Tailwind hex defaults specific to this project)
    # The design uses surface: #131b2e, surface_variant: #2d3449, etc.
    # So we map these to bootstrap custom classes, e.g. bg-surface, text-primary-custom
    r'bg-\[\#0b1326\]': 'bg-base',
    r'bg-\[\#131b2e\]': 'bg-surface-low',
    r'bg-\[\#222a3d\]': 'bg-surface-high',
    r'bg-\[\#2d3449\]': 'bg-surface-variant',
    r'bg-\[\#00d1ff\]': 'bg-primary-custom',
    r'bg-\[\#10b981\]': 'bg-success',
    r'bg-\[\#ef4444\]': 'bg-danger',
    r'text-\[\#00d1ff\]': 'text-primary-custom',
    r'text-\[\#10b981\]': 'text-success',
    r'text-\[\#ef4444\]': 'text-danger',
    r'text-\[\#a4e6ff\]': 'text-primary-light',
    
    # Border
    r'\bborder\b': 'border',
    r'\bborder-b\b': 'border-bottom',
    r'\bborder-t\b': 'border-top',
    r'\bborder-r\b': 'border-end',
    r'\bborder-l\b': 'border-start',
    r'border-\[\#2d3449\]': 'border-surface-variant',
    r'border-\[\#3c494e\]': 'border-outline-variant',
}

bootstrap_head = """
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
<link href="custom-bootstrap.css" rel="stylesheet">
"""

bootstrap_body = """
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmxc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
"""

def convert_to_bootstrap(html_content):
    # Remove tailwind script
    html_content = re.sub(r'<script src="https://cdn\.tailwindcss\.com\?plugins=[^>]*></script>', '', html_content)
    # Remove tailwind config
    html_content = re.sub(r'<script id="tailwind-config">.*?</script>', '', html_content, flags=re.DOTALL)
    
    # Add Bootstrap links
    html_content = html_content.replace('</head>', bootstrap_head + '</head>')
    html_content = html_content.replace('</body>', bootstrap_body + '</body>')
    
    # Process classes
    def replace_classes(match):
        classes = match.group(1)
        for pattern, replacement in class_mapping.items():
            classes = re.sub(pattern, replacement, classes, flags=re.IGNORECASE)
        return f'class="{classes}"'
        
    html_content = re.sub(r'class="([^"]*)"', replace_classes, html_content)
    return html_content

os.makedirs('/home/vinicius/Projetos/crypto-sandbox', exist_ok=True)
for filename, url in screens.items():
    print(f"Downloading and converting {filename}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    converted_html = convert_to_bootstrap(html)
    path = os.path.join('/home/vinicius/Projetos/crypto-sandbox', filename)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(converted_html)

print("Conversion completed.")
