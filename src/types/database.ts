export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          subscription_tier: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          subscription_tier?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          subscription_tier?: string
          created_at?: string
          updated_at?: string
        }
      }
      trade_setups: {
        Row: {
          id: string
          user_id: string
          instrument: string
          account_balance: number
          risk_per_trade: number
          entry_price: number
          stop_loss_price: number
          take_profit_price?: number
          leverage: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          instrument: string
          account_balance: number
          risk_per_trade: number
          entry_price: number
          stop_loss_price: number
          take_profit_price?: number
          leverage: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          instrument?: string
          account_balance?: number
          risk_per_trade?: number
          entry_price?: number
          stop_loss_price?: number
          take_profit_price?: number
          leverage?: number
          created_at?: string
        }
      }
      calculation_results: {
        Row: {
          id: string
          trade_setup_id: string
          position_size: number
          margin_required: number
          risk_reward_ratio: number
          capital_at_risk: number
          created_at: string
        }
        Insert: {
          id?: string
          trade_setup_id: string
          position_size: number
          margin_required: number
          risk_reward_ratio: number
          capital_at_risk: number
          created_at?: string
        }
        Update: {
          id?: string
          trade_setup_id?: string
          position_size?: number
          margin_required?: number
          risk_reward_ratio?: number
          capital_at_risk?: number
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          tier: string
          status: string
          current_period_start: string
          current_period_end: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tier: string
          status: string
          current_period_start: string
          current_period_end: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tier?: string
          status?: string
          current_period_start?: string
          current_period_end?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_tier: 'free' | 'pro' | 'premium'
      subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing'
    }
  }
}

