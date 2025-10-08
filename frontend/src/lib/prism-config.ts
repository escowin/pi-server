// Custom Prism configuration with only the languages we need
import Prism from 'prismjs';

// Import only the languages we actually use
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-nginx';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-ini';

// Import the theme
import 'prismjs/themes/prism-tomorrow.css';

export default Prism;
