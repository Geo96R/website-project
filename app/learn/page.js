'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Comprehensive DevOps Learning Topics (100+ topics) - Using specific names to avoid ambiguity
const devopsTopics = [
  // Cloud Platforms
  'Amazon Web Services', 'Google Cloud Platform', 'Microsoft Azure', 'IBM Cloud', 'Oracle Cloud',
  'DigitalOcean', 'Linode', 'Vultr', 'Hetzner', 'Scaleway',
  
  // AWS Services
  'Amazon EC2', 'Amazon S3', 'Amazon RDS', 'Amazon Lambda', 'Amazon VPC',
  'Amazon Route 53', 'Amazon CloudFront', 'Amazon SNS', 'Amazon SQS', 'Amazon EKS',
  'Amazon ECS', 'Amazon Fargate', 'Amazon EBS', 'Amazon EFS', 'Amazon IAM',
  'Amazon CloudWatch', 'Amazon CloudFormation', 'Amazon CodePipeline', 'Amazon CodeBuild',
  'Amazon CodeDeploy', 'Amazon API Gateway', 'Amazon DynamoDB', 'Amazon ElastiCache',
  'Amazon Redshift', 'Amazon Kinesis', 'Amazon Sagemaker', 'Amazon Rekognition',
  
  // Google Cloud Services
  'Google Compute Engine', 'Google Cloud Storage', 'Google Kubernetes Engine', 'Google Cloud Functions',
  'Google Cloud SQL', 'Google Cloud BigQuery', 'Google Cloud Pub/Sub', 'Google Cloud CDN',
  'Google Cloud Load Balancing', 'Google Cloud IAM', 'Google Cloud Monitoring',
  
  // Containerization & Orchestration - Using specific names to avoid ambiguity
  'Docker (software)', 'Kubernetes', 'Docker Compose', 'Docker Swarm', 'Podman', 'Containerd',
  'Helm (package manager)', 'Kustomize', 'Istio (service mesh)', 'Linkerd', 'Consul Connect', 'Traefik',
  
  // Infrastructure as Code
  'Terraform', 'Ansible', 'Pulumi', 'CloudFormation', 'ARM Templates',
  'Chef', 'Puppet', 'SaltStack', 'Vagrant', 'Packer',
  
  // CI/CD & DevOps Tools
  'Jenkins', 'GitLab CI', 'GitHub Actions', 'Azure DevOps', 'CircleCI', 'Travis CI',
  'Bamboo', 'TeamCity', 'Spinnaker', 'ArgoCD', 'Flux', 'Tekton',
  
  // Monitoring & Observability
  'Prometheus', 'Grafana', 'ELK Stack', 'Splunk', 'Datadog', 'New Relic',
  'AppDynamics', 'Jaeger', 'Zipkin', 'OpenTelemetry', 'Fluentd', 'Logstash',
  'Kibana', 'Elasticsearch', 'InfluxDB', 'Telegraf', 'Nagios', 'Zabbix',
  
  // Security
  'OWASP', 'Vault', 'CyberArk', 'Keycloak', 'OAuth', 'OIDC', 'SAML',
  'SSL/TLS', 'PKI', 'Certificate Management', 'Secrets Management',
  'Zero Trust Security', 'Network Security', 'Firewall', 'WAF',
  'Penetration Testing', 'Vulnerability Assessment', 'Security Scanning',
  
  // Networking
  'TCP/IP', 'HTTP/HTTPS', 'DNS', 'Load Balancing', 'CDN', 'VPN',
  'SDN', 'Service Mesh', 'API Gateway', 'Reverse Proxy', 'Nginx',
  'Apache', 'HAProxy', 'Envoy Proxy', 'Consul', 'Eureka',
  
  // Databases
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra',
  'CouchDB', 'Neo4j', 'InfluxDB', 'TimescaleDB', 'CockroachDB',
  'Database Sharding', 'Database Replication', 'Database Backup',
  
  // Programming Languages
  'Python', 'Go', 'Rust', 'JavaScript', 'TypeScript', 'Java', 'C#',
  'Ruby', 'PHP', 'Shell Scripting', 'Bash', 'PowerShell',
  
  // Linux & Operating Systems
  'Ubuntu', 'CentOS', 'Red Hat Enterprise Linux', 'Debian', 'SUSE',
  'Alpine Linux', 'Amazon Linux', 'System Administration', 'Process Management',
  'Memory Management', 'File Systems', 'Package Management',
  
  // Chaos Engineering & Disaster Recovery
  'Chaos Engineering', 'Disaster Recovery', 'Business Continuity', 'High Availability',
  'Fault Tolerance', 'Circuit Breaker Pattern', 'Bulkhead Pattern', 'Retry Pattern',
  'Chaos Monkey', 'Gremlin', 'Litmus', 'Chaos Toolkit',
  
  // Automation & Workflow
  'n8n', 'Zapier', 'Microsoft Power Automate', 'IFTTT', 'Workflow Automation',
  'Process Automation', 'Task Scheduling', 'Cron Jobs', 'Systemd Timers',
  
  // Microservices & Architecture
  'Microservices Architecture', 'Service-Oriented Architecture', 'Event-Driven Architecture',
  'CQRS Pattern', 'Saga Pattern', 'API Design', 'REST APIs', 'GraphQL',
  'gRPC', 'Message Queues', 'Event Streaming', 'Apache Kafka', 'RabbitMQ',
  
  // Performance & Optimization
  'Performance Monitoring', 'Application Performance Management', 'Capacity Planning',
  'Load Testing', 'Stress Testing', 'Caching Strategies', 'Database Optimization',
  'Query Optimization', 'Indexing', 'Connection Pooling',
  
  // Compliance & Governance
  'GDPR', 'HIPAA', 'SOX', 'PCI DSS', 'ISO 27001', 'SOC 2', 'Compliance Management',
  'Audit Logging', 'Data Governance', 'Risk Management', 'Change Management'
];

export default function LearnStream() {
  const [currentTopic, setCurrentTopic] = useState(null);
  const [topicContent, setTopicContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Load a guaranteed working topic on component mount
  useEffect(() => {
    loadGuaranteedWorkingTopic();
  }, []);

  const loadGuaranteedWorkingTopic = async () => {
    // Start with guaranteed working topics (using specific names)
    const guaranteedTopics = [
      'Docker (software)', 'Kubernetes', 'Amazon Web Services', 'Google Cloud Platform',
      'Terraform (software)', 'Ansible (software)', 'Jenkins (software)', 'Prometheus (software)', 'Grafana', 'Linux',
      'Python (programming language)', 'Bash (Unix shell)', 'Git', 'CI/CD', 'Microservices', 'DevOps'
    ];
    
    const randomTopic = guaranteedTopics[Math.floor(Math.random() * guaranteedTopics.length)];
    await loadTopicContent(randomTopic);
  };

  const loadRandomTopic = async () => {
    const randomTopic = devopsTopics[Math.floor(Math.random() * devopsTopics.length)];
    await loadTopicContent(randomTopic);
  };

  const loadTopicContent = async (topic) => {
    setLoading(true);
    setError(null);
    setCurrentTopic(topic);
    setSelectedTopic(topic);

    try {
      const response = await fetch(`/api/wikipedia?topic=${encodeURIComponent(topic)}`);
      const data = await response.json();
      
      if (data.success) {
        setTopicContent(data.content);
      } else {
        setError(data.content || `Could not find content for "${topic}". Please try another topic.`);
        setTopicContent('');
      }
        } catch (err) {
          console.error('Error loading topic:', err);
          // Try a guaranteed working topic
          const guaranteedTopics = ['Docker (software)', 'Kubernetes', 'Linux'];
          const guaranteedTopic = guaranteedTopics[Math.floor(Math.random() * guaranteedTopics.length)];
          console.log(`Network error, trying guaranteed topic: ${guaranteedTopic}`);
          await loadTopicContent(guaranteedTopic);
        } finally {
      setLoading(false);
    }
  };

  const handleTopicSelect = (topic) => {
    loadTopicContent(topic);
  };

  return (
    <div className="min-h-screen bg-black text-tron-cyan font-mono">
      {/* Header */}
      <div className="border-b border-tron-cyan/30 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-tron-cyan mb-2">
            LEARN <span className="text-tron-blue">.STREAM</span>
          </h1>
          <p className="text-gray-400">DevOps Knowledge Base - Continuous Learning Platform</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Topic Selector Sidebar */}
          <div className="lg:col-span-1">
            <div className="border border-tron-cyan/30 p-4 h-fit">
              <h3 className="text-lg font-bold text-tron-cyan mb-4">TOPIC SELECTOR</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {devopsTopics.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => handleTopicSelect(topic)}
                    className={`w-full text-left p-2 text-sm transition-colors ${
                      selectedTopic === topic
                        ? 'bg-tron-cyan/20 text-tron-cyan border border-tron-cyan/50'
                        : 'text-gray-400 hover:text-tron-cyan hover:bg-tron-cyan/10'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="border border-tron-cyan/30 p-6">
              {/* Controls */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-tron-cyan">
                  {currentTopic || 'Select a Topic'}
                </h2>
                <button
                  onClick={loadRandomTopic}
                  className="px-4 py-2 bg-tron-cyan/20 border border-tron-cyan text-tron-cyan hover:bg-tron-cyan/30 transition-colors"
                >
                  NEXT TOPIC
                </button>
              </div>

              {/* Content */}
              <div className="min-h-96">
                {loading ? (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-tron-cyan">
                      <div className="animate-pulse">LOADING KNOWLEDGE...</div>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-red-400">
                    <h3 className="text-lg font-bold mb-2">ERROR</h3>
                    <p>{error}</p>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <div 
                      className="text-gray-300 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: topicContent
                          .replace(/\n/g, '<br>')
                          .replace(/(https?:\/\/[^\s<>"]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">$1</a>')
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
