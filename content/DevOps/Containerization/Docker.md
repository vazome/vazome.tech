---
date created: 2024-06-14T22:29:54+04:00
date modified: 2025-06-14T23:57:07+04:00
tags:
  - containers/docker
---
**Runs isolated containers which utilize kernel from the Host**, Container is isolated system environment. Utilizes LXC containers, removing boilerplate for us.

# Theory
> [!important] Linux vs Windows
> Important to know that you cannot run Windows containers on Linux host. Host Kernel and image must match, because docker utilizes system kernel. 
## VMs vs Containers
They key difference is that VM utilizes fully separate OS, while container is an isolated too, which utilizes Host's kernel to "emulate" the OS. This leads to higher overhead of maintenance and resource utilization for Virtual Machines.
## Connection with Host
Docker containers isolated on each own via namespaces. 
![[Pasted image 20250509003647.png]]
If we look into processes deeply, docker container actually creates processes on the host system 
PID5 (nginx) - PID6(run) for example, but on the container it would be PID1(nginx) -> PID2(run). Since on Linux first process spans every other. You can actually see docker container processes on host system itself, it will just have different process ID.
![[Pasted image 20250509004243.png]]
By using cgroups we can limit how many system resources container uses, it's implemented as CLI option to docker run.
![[Pasted image 20250509004535.png]]
When we build we create layers and reuse them when available. Layers can be shared between two separate containers.
![[Pasted image 20250509004925.png]]
This means that we cannot modify `app.py` file which was pulled from Github during build stage, so as a workaround docker uses mechanism called COPY-ON-WRITE, so this file is copied to RW container layer one we done editing it.
![[Pasted image 20250509005252.png]]

## Docker vs ContainerD
Initially K8S worked with Docker worked only. Then they developed CRI Container Runtime Interface which contains OCI image standards, so other parties which use these standards can replace Docker. Docker itself is a set of tools, like run, CLI, build... `dockershim`. 

Container runtime is responsible for running the containers.

>The Container Runtime Interface (CRI) is the main protocol for the communication between the [kubelet](https://kubernetes.io/docs/reference/generated/kubelet) and Container Runtime.

Docker at the time did not adhere to standards, the container runtime `dockershim` was a tech debt, so they replaced it with `containerd` runtime.

`containerd` is a separate project now that is tightly integrated with Docker. If you don't need Docker tools, you can use just it and provisioned `ctr` tool, but it's mostly for debugging. Better CLI tool would be `neerdctl` which is interoperable with `docker` CLI and has unique features.

There is also `crictl` which is used form #containers/kubernetes perspective. Also better for debugging, not usage. Aware of pods.
![[Pasted image 20250615002720.png|400]]

Reference: [containerd vs. Docker \| Docker](https://www.docker.com/blog/containerd-vs-docker/)
# Quick guide
Docker file must be named `Dockerfile` where you provide `INSTRUCTIONS (RUN)`  and `arguments (wget)`

``` bash
docker buildx build --platform linux/amd64 redbull-tracker-ge.txt -t docker.io/vazome/redbull-tracker-ge

docker push vazome/redbull-tracker-ge:latest
```
`docker run --name <nm> img` - start a new container from an image
	alternatively `docker-compose` for the same but via YAML config
	Can override CMD and ENTRYPOINT command defined in image ![[Pasted image 20250412200525.png]]
`docker {action} -d --name=redis redis-img` - launch docker in background, detached mode
`docker {action like exec} -it bash` - launch docker in interactive (user input) terminal mode.
`docker ps` - view docker that was in background you do
	`docker ps -f "name=<container-name>"`
`docker logs <cnt-id>` - get output from container
	`docker logs -f <cnt-id>`  - get output in real-time
`docker container rm <cnt-id>` - delete container
`docker container prune` - delete all stopped containers
`docker image prune -a` - delete all dangling images `-a` to remove unused containers
	**Unused** = images that aren't tied to any container, either in use or stopped.
	**Danglings** = unnamed image, when you only see the id, or none instead of the tag-name. ![[Pasted image 20250410020714.png|700]]![[Pasted image 20250410021838.png]]

docker image push image name to registry
**private registries**
docker login docker.corp-EVIL.com

docker tag tag1_nan:v1 docker.corp-EVIL.com/tag1_nan1:v1
docker image push  docker.corp-EVIL.com/tag1_nan1:v1

docker save -o image.tar tag1_nan:v1
docker load -i image_tar

docker run will load local and then from docker hub if you just give it name without url, 
but you can do `docker run --pull=never `
# Docker build

> [!info] Variables
> Builder: 
> 	- `ARGs` `ARG path=/home/repl` for the variable in builder, later addressed as `$path`
> 	- `ENVs` `ENV DB_user=pipeline_user` still accessible **after image is built**, runtime
> Builder CLI: `docker build --build-arg project_folder=/repl/pipeline .`
> Runner: 
> 	- `docker run --env <key> =< value> <image-name>`
> 	- `docker run --env POSTGRES_USER=test_db --env POSTGRES_PASSWORD=test_db postgres`
> Logically, it's insecure to store secrets in vars, they show up in `docker history`

Dockerfile needs to be in the directory with YAML def

docker build -t (--tag)![[Pasted image 20250411012426.png]]

CMD executed when container is running, does not add build time. Only the last one executed.

WORKDIR : Changes the working directory for all following instructions, affects commands like COPY, docker run override or RUN (it's basically a variable for assumed root path). We can still use absolute paths. Affects CMD
	![[Pasted image 20250412202323.png|400]]
USER : Changes the user for all following instructions, so we don't user `root` user for all stuff. No other user is allowed to be used after defining this. Affects CMD

`ADD` vs `COPY`, `ADD` can retrieve from remote sources, but it's advised to use `CURL` or `WGET`, `unzip` and `rm` instead of `ADD`


> [!important]
> `RUN` during build, `CMD` launch something when container starts and `ENTRYPOINT` default executable which you can't override.
> The `CMD` instruction can be used to provide default arguments to an `ENTRYPOINT` if it is specified in the exec form
> ``` shell
> ENTRYPOINT ["python", "/app/my_script.py"]
> CMD ["--default-arg"]
> ```
> Both can be overridden `docker run -it --entrypoint /bin/bash test-override`
> 
> [Docker Best Practices: Choosing Between RUN, CMD, and ENTRYPOINT \| Docker](https://www.docker.com/blog/docker-best-practices-choosing-between-run-cmd-and-entrypoint/)


## Docker Caching

> [!info] Cache Layers vs Cache Mounts
> So the key difference is that cache layers can be discarded if I change the underlying configuration (being tied to Dockerfile instruction fields or files used), but cache mounts persist even if I change files like requirements.txt or pyproject.toml so that packages to install can remain, but if I add a new one it will download it also

Ideally, for effective caching, so it doesn't over-cache (not downloading new python version) put declarations from lest changing to most changing.

You can force avoid cache by "--no-cache or --no-cache-filter" options.

![[Pasted image 20250412201424.png]]

You can consider cache mounting, t
# Docker Run
Check container network and all other specs
`docker inspect <id>` 

Linking containers together would be better achieved via user-defined bridge instead of `--link`
## Docker Network
Behind networking are docker namespaces, each container gets its own namespace


By default docker creates 3 networks Bridge, None and Host. Docker has embedded DNS server 127.0.0.11, based on container name.

You change network this way
`docker run <image> --network=none`

Though you can create new docker bridge network to separate to network (-d for driver)
`docker network create -d bridge my-bridge-network`
![[Pasted image 20250508224415.png]]
### Port mapping 
Port mapping works this way 8080:80 where 8080 is port on host and 80 is port in the container
![[Pasted image 20250508224739.png|400]]![[Pasted image 20250508225635.png|300]]
To map it this way, you can do `docker run -p port:port <id>`
![[Pasted image 20250508225834.png]]
## Volume mapping

| Feature                    | Named Volume                | Anonymous Volume            | Bind Mount                          |
|---------------------------|-----------------------------|-----------------------------|-------------------------------------|
| Syntax                    | `-v myvol:/app/data`        | `-v /app/data`              | `-v $(pwd)/data:/app/data`          |
| Backed by Docker engine   | ✅ Yes                      | ✅ Yes                      | ❌ No (uses host filesystem)        |
| Automatically removed by `--rm` | ❌ No               | ✅ Yes                      | ❌ No                               |
| File location (host)      | Docker-managed (`/var/lib/docker/volumes/`) | Same as named | Explicit path on host (e.g. `/home/user/data`) |
| Portability               | ✅ Easy to share between containers | ❌ Difficult (unnamed) | ❌ Host-specific paths              |
| Use case                  | Persistent app data (e.g. DBs) | Temp/intermediate data     | Mount config/code/secrets           |
| Can mount single file     | ❌ No                        | ❌ No                        | ✅ Yes                              |
| Hot-reload for dev        | ❌ No                        | ❌ No                        | ✅ Yes (host file updates reflected)|
| Access control (ro/rw)    | ✅ Supported                | ✅ Supported                | ✅ Supported                        |

Data management is done via storage drivers.

> [!warning] `-v` vs `--mount`
> Using `-v` is outdated use --mount
> 
> ``` shell
> docker run \
> --mount type=bind, source=/data/mysql,target=/var/lib/mysq1 mysq1
> ```

There are times when you need to import file and assign a variable, my use case was this 
`--rm` removes container and anonymous volumes after finishing (only  
volumes specified without a name, e.g. `docker run -v /foo` instead of  
`docker run -v awesome:/foo` are removed.) IN OUR CASE VOLUME REMOVED BECAUSE IT'S A BIND VOLUME

but usage of volumes is deprecated, USE MOUNTS...
```
docker run --rm \
  -e GOOGLE_APPLICATION_CREDENTIALS="$GOOGLE_APPLICATION_CREDENTIAL" \
  -e API_TYPESENSE_KEY="$API_TYPESENSE_KEY" \
  -e API_TYPESENSE_HOST="$API_TYPESENSE_HOST" \
  $VS_IMAGE_NAME:latest

```

``` shell
docker run --rm \
  -e GOOGLE_APPLICATION_CREDENTIALS=/app/firebase.json \
  -e API_TYPESENSE_KEY="$API_TYPESENSE_KEY" \
  -e API_TYPESENSE_HOST="$API_TYPESENSE_HOST" \
  -v $GOOGLE_APPLICATION_CREDENTIALS:/app/firebase.json:ro \
  $VS_IMAGE_NAME:latest
```
For data persistence, 
**Bind mounting**: a way of mapping a volume from a directory on the host: `docker run -v /opt/datadir:/var/lib/mysql mysql` where `/opt/datadir` is a host directory: 
![[Pasted image 20250508230203.png]]
Volume mounting: though in some cases you may prefer mounting by creating a volume first like `docker volume create data_volume` and doing `docker rum -v data_volume1:/var/lib/mysql mysql`

# Docker Compose
This is where you define your multi-container using YAML configuration

> [!abstract] Docker Compose vs Kubernetes
> docker-compose allows you to coordinate MANY containers in the same computer using 1 YAML file instead of manually running commands for each container.
> 
> k8s allows you to coordinate MANY containers in different computers, using MANY YAML files. It's a lot more complicated than docker-compose, but also much more powerful.

`docker compose up` to run the compose config, but if images are custom you should specify image as path to the directory where their respective `Dockerfile` is located.
![[Pasted image 20250508233010.png]]
*outdate Version 1 on the image*
There are many version of docker-compose config.

- Version 1: no prioritization, uses outdated linking networking and bridging over it.
- Version 2: Uses dedicated bridging and DNS, has depends-on.
- Version 3: Support Swarm.
- **But later on versions 2.x and 3.x of the Compose file format were merged into the Compose Specification** [compose-spec/spec.md at main · compose-spec/compose-spec · GitHub](https://github.com/compose-spec/compose-spec/blob/main/spec.md)
	- So specifying version no longer needed on new compose cli version, though you can for backward compatibility 

Most important sections:
- Version (Optional)
- Services (Required)
- Networks
- Volumes
- Configs
- Secrets

## multistage building

Defined by two FROM fields in Dockerfile. It allows us to create two images within one where first we compile the application and then build the image that will launch the program. We do this to reduce the size of the end image to ensure it does not contain the tools necessary for image building.

## secret management
[Secrets \| Docker Docs](https://docs.docker.com/build/building/secrets/#secret-mounts)
There are 3 main ways, secret mounting, ssh mount and git stuff
``` dockerfile
RUN --mount=type=secret,id=gcp,env=GOOGLE_APPLICATION_CREDENTIALS \
    --mount=type=secret,id=typesense,env=API_TYPESENSE_KEY
```

``` shell
VS_IMAGE_NAME="vs-app-api" VER="v2" && \
op run -- docker build \
  --secret id=GOOGLE_APPLICATION_CREDENTIALS,env=GOOGLE_APPLICATION_CREDENTIALS \
  --secret id=API_TYPESENSE_KEY,env=API_TYPESENSE_KEY \
  --secret id=API_TYPESENSE_HOST,env=API_TYPESENSE_HOST \
  -t $VS_IMAGE_NAME:$VER \
  -f Docker/Dockerfile . && \
docker tag $VS_IMAGE_NAME:$VER $VS_IMAGE_NAME:latest
```