import time
from conf.config import param
from util.DataLoader import DataLoader
from util.tool import seedSet
from util.language import getAIanalysis
from ARLib import ARLib
import os
import torch
import numpy as np
import random

from flask import Flask, render_template
from flask_socketio import SocketIO, emit


def start(opt):
    # print(opt)
    params = param()
    params.update(opt)

    # 2. Import recommend model and attack model
    os.environ['CUDA_VISIBLE_DEVICES'] = params.gpu_id
    seed = params.seed
    seedSet(seed)

    import_str = 'from recommender.' + params.model_name + ' import ' + params.model_name
    exec(import_str)
    import_str = 'from attack.' + params.attackCategory + "." + params.attackModelName + ' import ' + params.attackModelName
    exec(import_str)

    # 3. Load data
    data = DataLoader(params)
    # 4. Define recommend model and attack model, and define ARLib to control the process
    recommend_model = eval(params.model_name)(params, data)
    attack_model = eval(params.attackModelName)(params, data)
    arlib = ARLib(recommend_model, attack_model, params)

    s = time.time()

    # 5. Train and test in clean data (before attack)
    arlib.RecommendTrain()
    arlib.RecommendTest()
    # 6. Attack
    # generate poison data, and then train/test in poisoning data (after attack)
    arlib.PoisonDataAttack()
    for step in range(arlib.times):
        print("attack step:{}".format(step))
        # seedSet(seed)
        arlib.RecommendTrain(attack=step)
        arlib.RecommendTest(attack=step)

    # 7. N times experimental results analysis (on average)
    arlib.ResultAnalysis()
    
    print([arlib.clean_result,arlib.poisoned_result])
    
    
    emit('result', [arlib.clean_result, arlib.poisoned_result])
    e = time.time()
    emit('end', e - s)
    print("Running time: %f s" % (e - s))
    getAIanalysis([arlib.clean_result, arlib.poisoned_result])
app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('start_training')
def handle_start_training(data):
    emit('control','training_begin')
    start(data)
    emit('control','training_end')
    
    

if __name__ == '__main__':
    
    socketio.run(app, debug=True)