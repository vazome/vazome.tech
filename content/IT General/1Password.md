```shell
echo -n $(op item get 3sfjg4kbmyi4pco3jwsjucowoy --reveal --format=json | jq -r '.fields[] | select(.label == "api key terraform") | .value') | hcp vault-secrets secrets create hetzner_api --data-file=-
```

