import { Injectable, OnModuleInit } from '@nestjs/common';
import { BaseBroadcasterGateway } from './base_broadcaster.gateway';
import { Data, Estimated_Impact, Pool_Snapshot, Recommendation, Signal, TusdtBroadcastResponse } from 'lib/common';
import { get } from 'http';

const aplha = {
  critical: 1000,
  high: 500,
  medium: 100,
  low: 0,
}


@Injectable()
export class BaseBroadcasterService implements OnModuleInit {
  constructor(private gateway: BaseBroadcasterGateway) { }
  
  private taoBalance = 1000;
  private taoPriceUsdt = 2.5;           

  private alphaBalance = 200000;         
  private tusdtSupply = 10000; 
  private alphaPriceUsdt = 1;


  getPoolSnapshot() {
 
    const taoValueUsdt = this.taoBalance * this.taoPriceUsdt;
    const alphaValueUsdt = this.alphaBalance * this.alphaPriceUsdt;
    const totalLiquidityUsdt = taoValueUsdt + alphaValueUsdt;
    const ipValuePerTusdt = totalLiquidityUsdt / this.tusdtSupply;

    return {
      tao_blance: this.taoBalance,
      tao_price_usdt: this.taoPriceUsdt,
      tao_value_usdt: taoValueUsdt,
      alpha_balance: this.alphaBalance,
      alpha_price_usdt: this.alphaPriceUsdt,
      alpha_value_usdt: alphaValueUsdt,
      tusdt_supply: this.tusdtSupply,
      Ip_value_per_tusdt: ipValuePerTusdt,
      total_liquidity_usdt: totalLiquidityUsdt,
    }
  }

  calculateTusdtPrice(): number {


    const price = this.getPoolSnapshot().Ip_value_per_tusdt;
    return price;
  }


  private generateSignal(price: number, deviation: number): Signal {


//0.98 to 1.02 liq
    if (deviation >= 10) {
      return {
        type: 'SELL_ALPHA',
        urgency: 'critical',
        alpha_amount: aplha.critical,
        reason: `TUSDT over-pegged at $${price.toFixed(2)}, requires alpha sale to restore peg`,
      };
    }

    if (deviation >= 5) {
      return {
        type: 'SELL_ALPHA',
        urgency: 'high',
        alpha_amount: aplha.high,
        reason: `TUSDT over-pegged at $${price.toFixed(2)}, alpha sale recommended`,
      };
    }

    if (deviation >= 2) {
      return {
        type: 'SELL_ALPHA',
        urgency: 'medium',
        alpha_amount: aplha.medium,
        reason: `TUSDT slightly over-pegged at $${price.toFixed(2)}, consider alpha sale`,
      };
    }


    if (deviation <= -10) {
      return {
        type: 'BUY_ALPHA',
        urgency: 'critical',
        alpha_amount: aplha.critical,
        reason: `TUSDT under-pegged at $${price.toFixed(2)}, requires alpha purchase to restore peg`,
      };
    }

    if (deviation <= -5) {
      return {
        type: 'BUY_ALPHA',
        urgency: 'high',
        alpha_amount: aplha.high,
        reason: `TUSDT under-pegged at $${price.toFixed(2)}, alpha purchase recommended`,
      };
    }

    if (deviation <= -2) {
      return {
        type: 'BUY_ALPHA',
        urgency: 'medium',
        alpha_amount: aplha.medium,
        reason: `TUSDT slightly under-pegged at $${price.toFixed(2)}, consider alpha purchase`,
      };
    }

    return {
      type: 'HOLD',
      urgency: 'low',
      alpha_amount: aplha.low,
      reason: `TUSDT at $${price.toFixed(2)}, within acceptable peg range`,
    };
  }

   private applySignal(signal: Signal) {
    if (signal.type === 'SELL_ALPHA') {
      this.alphaBalance -= signal.alpha_amount;
    } else if (signal.type === 'BUY_ALPHA') {
      this.alphaBalance += signal.alpha_amount;
    }
    
  }

  calculateNewIpValuee(pool: Pool_Snapshot, signal: Signal): number {

    if (signal.type === 'BUY_ALPHA') {
      const taoValue = pool.tao_value_usdt;
      const newAlphaValue = pool.alpha_value_usdt + signal.alpha_amount;
      const totalLiquidity = taoValue + newAlphaValue;
      const newIpValue = totalLiquidity / pool.tusdt_supply;
      return newIpValue;
    }



    if (signal.type === 'SELL_ALPHA') {
      const taoValue = pool.tao_value_usdt;
      const newAlphaValue = pool.alpha_value_usdt - signal.alpha_amount;
      const totalLiquidity = taoValue + newAlphaValue;
      const newIpValue = totalLiquidity / pool.tusdt_supply;
      return newIpValue;
    }

    return pool.Ip_value_per_tusdt;


  }
  generateRecommendation(signal: Signal, pool: Pool_Snapshot): Recommendation {

    const action = signal.type;
    const amount = signal.alpha_amount;
    const estimated_impact = {
      new_alpha_balance: pool.alpha_balance - amount,
      new_ip_value: this.calculateNewIpValuee(pool, signal),
      peg_restoration_percent: 100,

    }
    return {
      action: action,
      amount: amount,
      estmated_impact: estimated_impact,
      deadline: Date.now(),
    }


  }

  pool_snapshot: Pool_Snapshot = this.getPoolSnapshot();

  finalData() {
    const currentPool = this.getPoolSnapshot();
    const price = this.calculateTusdtPrice();
    const deviation = (this.calculateTusdtPrice() - 1.00) / 1.00 * 100;
    const signal = this.generateSignal(price, deviation);
    const recommendation = this.generateRecommendation(signal, this.pool_snapshot);
    this.applySignal(signal);
    const newPool = this.getPoolSnapshot();
    return {
      tusdt_price: price,
      peg_target: 1.00,
      deviation_percent: deviation,
      signal: signal,
      pool_snapshot: newPool,
      recommendation: recommendation,
    }
  }

  onModuleInit() {
  setInterval(() => {
    const currentData: TusdtBroadcastResponse = {
      status: 'success',
      timestamp: Math.floor(Date.now()), 
      data: this.finalData(), 
    };

    this.gateway.broadcast('basedata', currentData);
  }, 1000);
}
}
