dev:
	npm run serve
build:
	npm run build
deploy:
	./scripts/deploy.sh
test-speed:
	docker run --rm --name lighthouse -it -v /home/mamadou/reports:/home/chrome/reports --security-opt seccomp=$HOME/chrome.json femtopixel/google-lighthouse https://herico.github.io/pomodoro-app/
