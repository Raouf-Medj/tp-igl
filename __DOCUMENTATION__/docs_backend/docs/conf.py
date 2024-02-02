# Configuration file for the Sphinx documentation builder.
#

import os
import sys

sys.path.insert(0, os.path.abspath('../../../backend'))

# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'SciFetch'
copyright = '2024, Equipe 3, Groupe 2'
author = 'Equipe 3, Groupe 2'
release = '0.0.1'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.napoleon',
    'sphinx.ext.viewcode'
]

autodoc_mock_imports = ['flask', 'flask_sqlalchemy', 'flask_bcrypt', 'flask_jwt_extended', 'flask_cors', 'elasticsearch', 'fitz', 'openai', 'dotenv']

autodoc_default_flags = ['members']

autodoc_default_options = {
    'members': True,            # Include all members (functions, classes, etc.)
}


templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']



# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'sphinx_rtd_theme'

html_static_path = ['_static']
html_show_sourcelink = True

