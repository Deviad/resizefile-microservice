import config from './src/config';
const {
  serviceAccount:
    { type,
      project_id,
      private_key_id,
      private_key,
      client_email,
      client_id,
      auth_uri, token_uri,
      auth_provider_x509_cert_url,
      client_x509_cert_url
    }
} = config;
export default {
  'auth_provider_x509_cert_url': auth_provider_x509_cert_url,
  'auth_uri': auth_uri,
  'client_email': client_email,
  'client_id': client_id,
  'client_x509_cert_url': client_x509_cert_url,
  'private_key': private_key,
  'private_key_id': private_key_id,
  'project_id': project_id,
  'token_uri': token_uri,
  'type': type,
};
