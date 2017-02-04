# run source venv/bin/activate before running the script
(make build && export PYTHONPATH=`pwd` && cd build/code && python runtime/rest/app.py && cd ../../) || cd ../../
