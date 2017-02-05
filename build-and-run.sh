# run source venv/bin/activate before running the script
(make build && cd build/code && export PYTHONPATH=`pwd` && python runtime/rest/app.py && cd ../../) || cd ../../
