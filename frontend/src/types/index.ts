export interface Phase {
  id: string;
  title: string;
  description: string;
  icon: string;
  steps: Step[];
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites: string[];
}

export interface Step {
  id: string;
  title: string;
  description: string;
  content: string;
  codeBlocks: CodeBlock[];
  tips: string[];
  warnings: string[];
  completed: boolean;
}

export interface CodeBlock {
  id: string;
  language: string;
  code: string;
  title?: string;
  description?: string;
}

export interface Technology {
  name: string;
  description: string;
  icon: string;
  category: 'OS' | 'Containerization' | 'Web Server' | 'Security' | 'Applications';
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
  benefits: string[];
}

export interface Prerequisite {
  type: 'Hardware' | 'Software';
  name: string;
  description: string;
  required: boolean;
}
